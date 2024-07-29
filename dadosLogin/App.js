import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, ActivityIndicator, TouchableOpacity, Platform, StatusBar, ImageBackground } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, firestore } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, query, where, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';

export default function App() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [entrada, setEntrada] = useState('');
  const [, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [mensagemEnviada, setMensagemEnviada] = useState(false);

  useEffect(() => {
    const atualizaUsuario = onAuthStateChanged(auth, (usuario) => {
      setUsuario(usuario);
    });

    return () => atualizaUsuario();
  }, []);

  useEffect(() => {
    if (usuario) {
      buscarMensagens();
    } else {
      setMensagens([]);
    }
  }, [usuario]);

  const buscarMensagens = async () => {
    setCarregando(true);
    try {
      if (usuario) {
        const q = query(collection(firestore, 'messages'), where('uid', '==', usuario.uid));
        const querySnapshot = await getDocs(q);
        const mensagensBuscadas = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMensagens(mensagensBuscadas);
      }
    } catch (error) {
      console.error("Erro ao buscar mensagens: ", error);
    } finally {
      setCarregando(false);
    }
  };

  const cadastrar = () => {
    createUserWithEmailAndPassword(auth, email, senha)
      .then(userCredential => {
        setUsuario(userCredential.user);
        setEmail('');
        setSenha('');
      })
      .catch(error => alert(error.message));
  };

  const entrar = () => {
    signInWithEmailAndPassword(auth, email, senha)
      .then(userCredential => {
        setUsuario(userCredential.user);
        setEmail('');
        setSenha('');
      })
      .catch(error => alert(error.message));
  };

  const sair = () => {
    signOut(auth)
      .then(() => setUsuario(null))
      .catch(error => alert(error.message));
  };

  const enviarMensagem = async () => {
    if (entrada && usuario) {
      try {
        await addDoc(collection(firestore, 'messages'), {
          text: entrada,
          createdAt: serverTimestamp(),
          uid: usuario.uid
        });
        setEntrada('');
        setMensagemEnviada(true);
        setTimeout(() => setMensagemEnviada(false), 3000);
        buscarMensagens();
      } catch (error) {
        console.error("Erro ao adicionar mensagem: ", error);
      }
    }
  };

  return (
    <ImageBackground source={require('./assets/bground.png')} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {usuario ? (
        <>
          <Text style={styles.welcomeText}>Bem-vindo, {usuario.email}</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite uma mensagem"
            value={entrada}
            onChangeText={setEntrada}
          />
          <TouchableOpacity style={styles.botao} onPress={enviarMensagem}>
            <MaterialIcons name="send" size={24} color="white" />
            <Text style={styles.botaoTexto}>Enviar Mensagem</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoSair} onPress={sair}>
            <MaterialIcons name="logout" size={24} color="white" />
            <Text style={styles.botaoTexto}>Sair</Text>
          </TouchableOpacity>
          {mensagemEnviada && (
            <Text style={styles.mensagemEnviada}>Mensagem enviada!</Text>
          )}
          {carregando ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <ScrollView style={styles.mensagensContainer}>
            </ScrollView>
          )}
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
          <TouchableOpacity style={styles.botao} onPress={cadastrar}>
            <MaterialIcons name="person-add" size={24} color="white" />
            <Text style={styles.botaoTexto}>Cadastrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botao} onPress={entrar}>
            <MaterialIcons name="login" size={24} color="white" />
            <Text style={styles.botaoTexto}>Entrar</Text>
          </TouchableOpacity>
        </>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    elevation: 4,
  },
  input: {
    fontSize: 20,
    width: '100%',
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  excluirBotao: {
    marginTop: 10,
    backgroundColor: '#CA222D',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  excluirTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  botao: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 3,
  },
  botaoSair: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 3,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  mensagemEnviada: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 12,
  },
});
