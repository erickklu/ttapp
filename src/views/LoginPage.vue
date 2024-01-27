<template>
  <ion-page>
    <ion-content>
      <ion-card style="height: 97%;">
        <ion-card-content class="ion-text-center" style="height: 100%;">

            <img src="/pucesdlogo.png" alt="">

            <h1>
              BIBLIOTECA
            </h1>
            <p>
              Ingrese su cédula
            </p>

            <ion-input placeholder="xxxxxxxxxx" v-model="cedula"></ion-input>
            <ion-button :disabled="cedula.length == 0" @click="obtenerDatos()"
              style="padding-top: 12px;">INGRESAR</ion-button>
         
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage, IonInput, IonButton, IonCard, IonCardContent, alertController } 
from '@ionic/vue';
import { useRouter } from 'vue-router';
import { CapacitorHttp as Http } from '@capacitor/core';
import { onMounted, ref } from 'vue';
import { Storage } from '@ionic/storage';
import axios from 'axios';


const store = new Storage();

onMounted(async () => {
  await store.create();
  user.value = await store.get('dato')
  
  if (user.value) {
     MenuPrincipal()
  }
});

const user = ref({
  apellidos: "",
  nombres: "",
  cedula: ""
})

const cedula = ref("")

async function obtenerDatos() {
  const options = {

    // URL a la ruta del servidor
    url: "http://localhost:3000/api/validar-cedula/" + cedula.value,
    headers: {
      "Content-Type": "application/json"
    },
  }

  try {
    const res = await Http.get(options);

    if (res.data.valid) {
      const datosEstudiante = await obtenerDatosEstudiante();

      // Almacenar datos en el almacenamiento local
      store.set('dato', datosEstudiante.estudiante)
      
      MenuPrincipal();

    } else {

      const alert = await alertController.create({
        header: 'Cédula no válida',
        buttons: ['Aceptar'],
      });
      await alert.present();
    }
  } catch (error) {
    console.error("Error al obtener datos del estudiante:", error);
  }
}

async function obtenerDatosEstudiante() {
  try {
    const response = await axios.get(`http://localhost:3000/api/obtener-datos-estudiante/${cedula.value}`);
    
    const estudiante = response.data.estudiante;

    return response.data;
  } catch (error) {
    console.error('Error al obtener datos del estudiante:', error);
    return null;
  }
}

//Cambio de vista
const router = useRouter()

function MenuPrincipal() {
  router.replace({ name: 'tabsp' })
}

</script>

<style scoped>
ion-button {
  --background: #2A9EF9;
}
</style>