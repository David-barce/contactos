import React, {useEffect, useState, useRef} from 'react';
import {Text, View, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import * as Contacts from 'expo-contacts';



const App = () => {

  const [contactos, setContactos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const firstUpdate           = useRef( true );



    useEffect( ()=>{
      if (firstUpdate.current) {
        getContactos();

        firstUpdate.current = false;

        return;
      }
    });


    const getContactos = async ()=>{

      const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers],
          });
          setContactos(data);
          console.log("permiso concedido" + JSON.stringify(data));
          Alert.alert("permiso concedido", "Exito");
        }
        else
        {
          console.log("permiso denegado");
          Alert.alert("permiso denegado", "Error");

        }
    }

    const agregaContacto = async () =>{
      let obj = {
        [Contacts.Fields.FirstName]: nombre,
        [Contacts.Fields.LastName]: apellido,
        [Contacts.Fields.PhoneNumbers]: [
            {
                number: telefono,
                isPrimary: true,
                digits: '1234567890',
                countryCode: 'mx',
                id: '1',
                label: 'main',
            },
        ]
    };
      const contactId = await Contacts.addContactAsync(obj);
      console.log(contactId);
      if(contactId != undefined)
      {
        console.log("se agrego el contacto");
        Alert.alert("se agrego el contacto", "Exito");

        getContactos();
        setApellido('');
        setNombre('');
        setTelefono('');
      }
    }

    return (
          <SafeAreaView>
          <View style={{marginTop:50, alignContent:"center", alignItems:"center"}}>
            <View style={{alignContent:"center", alignItems:"center"}}>
                  <Text style={{fontWeight:"bold"}}>Formulario de contacto:</Text>
                  <View>
                       <TextInput
                       placeholder='Nombre'
                       style={style.input}
                       onChangeText={(text) => { setNombre(text) }}
                       defaultValue={nombre}
                       />
                        <TextInput
                       placeholder='Apellido'
                       style={style.input}
                       onChangeText={(text) => { setApellido(text) }}
                            defaultValue={apellido}
                       />
                        <TextInput
                       placeholder='Numero'
                       style={style.input}
                       onChangeText={(text) => { setTelefono(text) }}
                       defaultValue={telefono}
                       keyboardType="phone-pad"
                       />
                  </View>
                  <TouchableOpacity style={style.loginBtn}
                        onPress={() =>{agregaContacto()}}
                    >
                        <Text style={style.loginText}>Registrar contacto</Text>
                    </TouchableOpacity>
            </View>

            <Text style={{marginTop:10, fontWeight:"bold"}}>Mis contactos son:</Text>
           <View style={{width:"80%", marginTop:20,backgroundColor:"#E7E6E2"}}>
            {/* {
              contactos.map((item) =>{
                return(
                  <View key={item.id}>
                     <Text>{item.name}</Text>
                     <Text>{item.phoneNumbers[0].digits}</Text>
                  </View>
                )
              })
            } */}

            <FlatList
            data={contactos}
            renderItem   = { ( { item } ) => { return (
              <View key={item.id} style={{marginVertical:5}}>
                     <Text>Nombre: {item.name}</Text>
                     <Text>Telefono: {item.phoneNumbers[0].digits}</Text>
              </View>
            )} }
            keyExtractor = { ( item ) => item.id.toString() }
            />
            </View>
          </View>
          </SafeAreaView>
    );

}
export default App;


const style = StyleSheet.create({
  input:{
    padding: 10,
    paddingStart: 15,
    width: 300,
    height: 50,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    fontSize: 15,
    marginTop: 10
  },
  loginBtn:{
    width:"90%",
    backgroundColor:"#fb5b5a",
    borderRadius:15,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:20
  },
  loginText:{
    color:"white"
  }
})
