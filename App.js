import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";

const Stack = createNativeStackNavigator();

// --- CONFIGURACIÓN DE DATOS INICIALES ---
const INITIAL_PLACES = [
  {
    id: "1",
    nombre: "Edificio A",
    tipo: "Edificio",
    descripcion: "Aulas de clases.",
    coords: { latitude: 13.71603474725433, longitude: -89.15341621892469 },
    fotoInicial: require("./assets/edificioA.jpg"),
    fotos: [],
    resenas: [],
  },
  {
    id: "2",
    nombre: "Edificio B",
    tipo: "Edificio",
    descripcion: "Aulas de clases.",
    coords: { latitude: 13.715791030032333, longitude: -89.1533474408222 },
    fotoInicial: require("./assets/edificioB.jpg"),
    fotos: [],
    resenas: [],
  },
  {
    id: "3",
    nombre: "Edificio C",
    tipo: "Edificio",
    descripcion: "Aulas de clases.",
    coords: { latitude: 13.715253650141312, longitude: -89.15324506621673 },
    fotoInicial: require("./assets/edificioC.jpg"),
    fotos: [],
    resenas: [],
  },
  {
    id: "4",
    nombre: "CITT Edificio 2",
    tipo: "Laboratorio",
    descripcion: "Centros de Innovación Tecnológica.",
    coords: { latitude: 13.715982882660196, longitude: -89.15488656894684 },
    fotoInicial: require("./assets/citt2.jpg"),
    fotos: [],
    resenas: [],
  },
  {
    id: "5",
    nombre: "CITT Edificio 3",
    tipo: "Laboratorio",
    descripcion: "Centros de Innovación Tecnológica.",
    coords: { latitude: 13.715799589949018, longitude: -89.15517242679111 },
    fotoInicial: require("./assets/citt3.jpg"),
    fotos: [],
    resenas: [],
  },
  {
    id: "6",
    nombre: "CITT Edificio 4",
    tipo: "Laboratorio",
    descripcion: "Centros de Innovación Tecnológica.",
    coords: { latitude: 13.71552337192804, longitude: -89.15543553716954 },
    fotoInicial: require("./assets/citt4.jpg"),
    fotos: [],
    resenas: [],
  },
  {
    id: "7",
    nombre: "CITT Edificio 5",
    tipo: "Laboratorio",
    descripcion: "Centros de Innovación Tecnológica.",
    coords: { latitude: 13.715127171492462, longitude: -89.15521615950449 },
    fotoInicial: require("./assets/citt5.jpg"),
    fotos: [],
    resenas: [],
  },
  {
    id: "8",
    nombre: "CITT Edificio 6",
    tipo: "Laboratorio",
    descripcion: "Centros de Innovación Tecnológica.",
    coords: { latitude: 13.714814019926878, longitude: -89.15534426568702 },
    fotoInicial: require("./assets/citt6.jpg"),
    fotos: [],
    resenas: [],
  },
  {
    id: "9",
    nombre: "CITT Edificio 7",
    tipo: "Laboratorio",
    descripcion: "Centros de Innovación Tecnológica.",
    coords: { latitude: 13.714444940863952, longitude: -89.15536434254476 },
    fotoInicial: require("./assets/citt7.jpg"),
    fotos: [],
    resenas: [],
  },
  {
    id: "10",
    nombre: "Aula Magna C",
    tipo: "Auditorio",
    descripcion: "Espacio para conferencias magistrales.",
    coords: { latitude: 13.715083882353778, longitude: -89.15426488120416 },
    fotoInicial: require("./assets/aulamagna.jpg"),
    fotos: [],
    resenas: [],
  },
  {
    id: "11",
    nombre: "Biblioteca Rafael Meza Ayau",
    tipo: "Biblioteca",
    descripcion: "Biblioteca estudiantil.",
    coords: { latitude: 13.716876019585817, longitude: -89.15363021260035 },
    fotoInicial: require("./assets/biblioteca.jpg"),
    fotos: [],
    resenas: [],
  },
  {
    id: "12",
    nombre: "Cafeteria UDB",
    tipo: "Cafeteria",
    descripcion: "Compra de alimentos de la universidad.",
    coords: { latitude: 13.715160985847104, longitude: -89.15280056916767 },
    fotoInicial: require("./assets/cafeteria.jpg"),
    fotos: [],
    resenas: [],
  },
  {
    id: "13",
    nombre: "Cafeterias del CITT",
    tipo: "Cafeteria",
    descripcion: "Cafeterias de los laboratorios CITT.",
    coords: { latitude: 13.714546048741974, longitude: -89.15577143609629 },
    fotoInicial: require("./assets/cafeteriacitt.jpg"),
    fotos: [],
    resenas: [],
  },
  {
    id: "14",
    nombre: "Capilla UDB",
    tipo: "Capilla",
    descripcion: "Centro religioso de la universidad.",
    coords: { latitude: 13.716379217700323, longitude: -89.15321724332479 },
    fotoInicial: require("./assets/capilla.jpg"),
    fotos: [],
    resenas: [],
  },
  {
    id: "15",
    nombre: "Escuela de Órtesis y Prótesis",
    tipo: "Facultad",
    descripcion: "Centro especializado en rehabilitación.",
    coords: { latitude: 13.71471745127453, longitude: -89.15399565059512 },
    fotoInicial: require("./assets/ortesis.jpg"),
    fotos: [],
    resenas: [],
  },
  {
    id: "16",
    nombre: "Hangar Aeronáutico UDB",
    tipo: "Laboratorio",
    descripcion: "Hangar para prácticas aeronáuticas.",
    coords: { latitude: 13.714420791253618, longitude: -89.15498711641054 },
    fotoInicial: require("./assets/hangar.jpg"),
    fotos: [],
    resenas: [],
  },
  {
    id: "17",
    nombre: "Observatorio Micro-Macro",
    tipo: "Ciencia",
    descripcion: "Investigación y divulgación científica.",
    coords: { latitude: 13.715919721120402, longitude: -89.15610009683995 },
    fotoInicial: require("./assets/observatorio.jpg"),
    fotos: [],
    resenas: [],
  },
  {
    id: "18",
    nombre: "OWCC",
    tipo: "Laboratorio",
    descripcion: "Centro de Ciencias Karlheinz Wolfgang.",
    coords: { latitude: 13.715509001589414, longitude: -89.15583892266558 },
    fotoInicial: require("./assets/owcc.jpg"),
    fotos: [],
    resenas: [],
  },
  {
    id: "19",
    nombre: "Edificio de Profesores",
    tipo: "Edificio",
    descripcion: "Oficinas de profesores UDB.",
    coords: { latitude: 13.715485603268194, longitude: -89.15282273990698 },
    fotoInicial: require("./assets/profesores.jpg"),
    fotos: [],
    resenas: [],
  },
  {
    id: "20",
    nombre: "Servicios Sanitarios",
    tipo: "Laboratorio",
    descripcion: "Laboratorio del CITT 2.",
    coords: { latitude: 13.715444753150221, longitude: -89.15345084899249 },
    fotoInicial: require("./assets/sanitarios.jpg"),
    fotos: [],
    resenas: [],
  },
  {
    id: "21",
    nombre: "Cajero Banco Agricola",
    tipo: "Cajero",
    descripcion: "ATM del Banco Agrícola.",
    coords: { latitude: 13.71497497627954, longitude: -89.15335623841663 },
    fotoInicial: require("./assets/cajero.jpg"),
    fotos: [],
    resenas: [],
  },
];

const getDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1) return 0;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
};

// --- PANTALLAS ---

function HomeScreen({ route, navigation }) {
  const [lugares, setLugares] = useState([]);
  const [userLoc, setUserLoc] = useState(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    const init = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        let loc = await Location.getCurrentPositionAsync({});
        setUserLoc(loc.coords);
      }
      let stored = await AsyncStorage.getItem("lugares_udb");
      if (!stored) {
        await AsyncStorage.setItem(
          "lugares_udb",
          JSON.stringify(INITIAL_PLACES),
        );
        setLugares(INITIAL_PLACES);
      } else {
        setLugares(JSON.parse(stored));
      }
    };
    const unsubscribe = navigation.addListener("focus", init);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (route.params?.focusLugarId && lugares.length > 0) {
      const lugar = lugares.find((l) => l.id === route.params.focusLugarId);
      if (lugar && mapRef.current) {
        mapRef.current.animateToRegion(
          { ...lugar.coords, latitudeDelta: 0.002, longitudeDelta: 0.002 },
          1000,
        );
        setTimeout(() => {
          if (markersRef.current[lugar.id])
            markersRef.current[lugar.id].showCallout();
        }, 1100);
      }
    }
  }, [route.params?.focusLugarId, lugares]);

  return (
    <View style={styles.flex1}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 13.7155,
          longitude: -89.154,
          latitudeDelta: 0.006,
          longitudeDelta: 0.006,
        }}
        showsUserLocation={true}
      >
        {lugares.map((lugar) => (
          <Marker
            key={lugar.id}
            ref={(el) => (markersRef.current[lugar.id] = el)}
            coordinate={lugar.coords}
            pinColor="#003366"
          >
            <Callout
              onPress={() =>
                navigation.navigate("Detalle", { lugarId: lugar.id })
              }
            >
              <View style={styles.calloutContainer}>
                <Image
                  source={
                    lugar.fotos.length > 0
                      ? { uri: lugar.fotos[0] }
                      : lugar.fotoInicial
                  }
                  style={styles.calloutImage}
                />
                <Text style={styles.calloutTitle}>{lugar.nombre}</Text>
                {userLoc && (
                  <Text style={styles.calloutDist}>
                    {getDistance(
                      userLoc.latitude,
                      userLoc.longitude,
                      lugar.coords.latitude,
                      lugar.coords.longitude,
                    )}{" "}
                    km
                  </Text>
                )}
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <TouchableOpacity
        style={styles.fabSimple}
        onPress={() => navigation.navigate("Listado")}
      >
        <Text style={styles.fabText}>VER LISTA</Text>
      </TouchableOpacity>
    </View>
  );
}

function ListadoScreen({ navigation }) {
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarDatos = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    let loc =
      status === "granted" ? await Location.getCurrentPositionAsync({}) : null;
    let stored = await AsyncStorage.getItem("lugares_udb");
    let data = stored ? JSON.parse(stored) : INITIAL_PLACES;
    if (loc) {
      data = data
        .map((l) => ({
          ...l,
          dist: getDistance(
            loc.coords.latitude,
            loc.coords.longitude,
            l.coords.latitude,
            l.coords.longitude,
          ),
        }))
        .sort((a, b) => a.dist - b.dist);
    }
    setLugares(data);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", cargarDatos);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.centerText}>Cargando...</Text>
      ) : (
        <FlatList
          data={lugares}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("Detalle", { lugarId: item.id })
              }
            >
              <View style={styles.cardLeft}>
                <Image
                  source={
                    item.fotos.length > 0
                      ? { uri: item.fotos[0] }
                      : item.fotoInicial
                  }
                  style={styles.listThumbnail}
                />
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>{item.nombre}</Text>
                  <Text style={styles.cardSubtitle}>
                    {item.tipo} •{" "}
                    <Text style={styles.distText}>{item.dist} km</Text>
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.mapIconBtn}
                onPress={() =>
                  navigation.navigate("Inicio", { focusLugarId: item.id })
                }
              >
                <Text style={{ fontSize: 18 }}>📍</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

function DetalleScreen({ route, navigation }) {
  const { lugarId } = route.params;
  const [lugar, setLugar] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [comentario, setComentario] = useState("");
  const [puntos, setPuntos] = useState(5);

  const cargarLugar = async () => {
    let stored = await AsyncStorage.getItem("lugares_udb");
    if (stored) {
      let data = JSON.parse(stored);
      setLugar(data.find((l) => l.id === lugarId));
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", cargarLugar);
    return unsubscribe;
  }, [navigation]);

  const agregarResena = async () => {
    if (!comentario.trim())
      return Alert.alert("Error", "Escribe un comentario.");
    let stored = await AsyncStorage.getItem("lugares_udb");
    let data = JSON.parse(stored);
    let idx = data.findIndex((l) => l.id === lugarId);
    data[idx].resenas.unshift({
      comentario,
      puntos,
      fecha: new Date().toLocaleDateString(),
    });
    await AsyncStorage.setItem("lugares_udb", JSON.stringify(data));
    setComentario("");
    setPuntos(5);
    cargarLugar();
    Alert.alert("Éxito", "Reseña guardada.");
  };

  const agregarFoto = async (metodo) => {
    const { status } =
      metodo === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    let res =
      metodo === "camera"
        ? await ImagePicker.launchCameraAsync({ quality: 0.5 })
        : await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
    if (!res.canceled) {
      let stored = await AsyncStorage.getItem("lugares_udb");
      let data = JSON.parse(stored);
      let idx = data.findIndex((l) => l.id === lugarId);
      data[idx].fotos.push(res.assets[0].uri);
      await AsyncStorage.setItem("lugares_udb", JSON.stringify(data));
      cargarLugar();
    }
  };

  // --- NUEVA FUNCIÓN: ELIMINAR FOTO ---
  const eliminarFoto = (uri) => {
    if (typeof uri === "number") return; // No permitir borrar la foto inicial (asset local)

    Alert.alert("Eliminar foto", "¿Deseas borrar esta imagen de la galería?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          let stored = await AsyncStorage.getItem("lugares_udb");
          let data = JSON.parse(stored);
          let idx = data.findIndex((l) => l.id === lugarId);
          data[idx].fotos = data[idx].fotos.filter((f) => f !== uri);
          await AsyncStorage.setItem("lugares_udb", JSON.stringify(data));
          cargarLugar();
        },
      },
    ]);
  };

  if (!lugar) return null;
  const todasLasFotos = [lugar.fotoInicial, ...lugar.fotos];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.flex1}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{lugar.nombre}</Text>
        <Text style={styles.desc}>{lugar.descripcion}</Text>
        <TouchableOpacity
          style={styles.btnMap}
          onPress={() =>
            navigation.navigate("Inicio", { focusLugarId: lugar.id })
          }
        >
          <Text style={styles.btnText}>📍 VER EN MAPA</Text>
        </TouchableOpacity>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => agregarFoto("camera")}
          >
            <Text style={styles.btnText}>CÁMARA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => agregarFoto("gallery")}
          >
            <Text style={styles.btnText}>GALERÍA</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.section}>
          Galería (Mantén presionado para borrar)
        </Text>
        <ScrollView horizontal>
          {todasLasFotos.map((f, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                setSelectedImg(f);
                setModalVisible(true);
              }}
              onLongPress={() => eliminarFoto(f)} // Trigger para eliminar
            >
              <Image
                source={typeof f === "number" ? f : { uri: f }}
                style={styles.imageThumb}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.resenaBox}>
          <Text style={styles.section}>Deja tu reseña</Text>
          <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((s) => (
              <TouchableOpacity key={s} onPress={() => setPuntos(s)}>
                <Text
                  style={{
                    fontSize: 30,
                    color: s <= puntos ? "#FFD700" : "#ccc",
                  }}
                >
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder="¿Qué te pareció este lugar?"
            value={comentario}
            onChangeText={setComentario}
            multiline={true}
          />
          <TouchableOpacity style={styles.btnSend} onPress={agregarResena}>
            <Text style={styles.btnText}>PUBLICAR RESEÑA</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.section}>Reseñas de la comunidad</Text>
        {lugar.resenas.length === 0 ? (
          <Text style={{ fontStyle: "italic", color: "#999" }}>
            No hay reseñas aún.
          </Text>
        ) : (
          lugar.resenas.map((r, i) => (
            <View key={i} style={styles.resenaCard}>
              <Text style={styles.resenaStars}>{"★".repeat(r.puntos)}</Text>
              <Text>{r.comentario}</Text>
              <Text style={styles.resenaFecha}>{r.fecha}</Text>
            </View>
          ))
        )}
        <View style={{ height: 60 }} />
        <Modal visible={modalVisible} transparent={true}>
          <View style={styles.modal}>
            <TouchableOpacity
              style={styles.close}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#fff" }}>Cerrar</Text>
            </TouchableOpacity>
            <Image
              source={
                typeof selectedImg === "number"
                  ? selectedImg
                  : { uri: selectedImg }
              }
              style={styles.fullImg}
              resizeMode="contain"
            />
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#003366" },
          headerTintColor: "#fff",
        }}
      >
        <Stack.Screen name="Inicio" component={HomeScreen} />
        <Stack.Screen name="Listado" component={ListadoScreen} />
        <Stack.Screen name="Detalle" component={DetalleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  map: { flex: 1 },
  container: { flex: 1, padding: 16 },
  card: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  cardLeft: { flexDirection: "row", flex: 1, alignItems: "center" },
  listThumbnail: { width: 50, height: 50, borderRadius: 5, marginRight: 10 },
  cardTitle: { fontWeight: "bold", color: "#003366", fontSize: 16 },
  cardSubtitle: { color: "#666", fontSize: 13 },
  distText: { color: "#d1a000", fontWeight: "bold" },
  mapIconBtn: { padding: 10, backgroundColor: "#f0f0f0", borderRadius: 5 },
  calloutContainer: { width: 140, alignItems: "center" },
  calloutImage: { width: 130, height: 80, borderRadius: 5 },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
  calloutDist: { color: "#d1a000", fontSize: 10, fontWeight: "bold" },
  fabSimple: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#003366",
    padding: 15,
    borderRadius: 25,
    elevation: 5,
  },
  fabText: { color: "#fff", fontWeight: "bold" },
  title: { fontSize: 24, fontWeight: "bold", color: "#003366" },
  desc: { marginVertical: 10, color: "#444", fontSize: 16 },
  btnMap: {
    backgroundColor: "#d1a000",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  row: { flexDirection: "row", gap: 10 },
  btn: {
    flex: 1,
    backgroundColor: "#003366",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  btnSend: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  section: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 10,
    color: "#003366",
  },
  imageThumb: { width: 120, height: 120, marginRight: 10, borderRadius: 8 },
  resenaBox: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  starContainer: { flexDirection: "row", marginBottom: 10 },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    minHeight: 80,
    textAlignVertical: "top",
  },
  resenaCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
    borderLeftWidth: 4,
    borderLeftColor: "#003366",
  },
  resenaStars: { color: "#FFD700", fontSize: 16, marginBottom: 4 },
  resenaFecha: { fontSize: 10, color: "#999", marginTop: 5 },
  modal: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImg: { width: "90%", height: "70%" },
  close: { position: "absolute", top: 40, right: 20 },
  centerText: { textAlign: "center", marginTop: 20 },
});
