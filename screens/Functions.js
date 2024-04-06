// import { getStorage, ref, getDownloadURL } from "@firebase/storage";
// export const getPublicImageUrl = (user) => {
//   try {
//     console.log("user auth", user);
//     let public_url = null;
//     const storage = getStorage();
//     getDownloadURL(ref(storage, `gs://tinder-2-tin.appspot.com/${user.email}`))
//       .then((url) => {
//         // `url` is the download URL for 'images/stars.jpg'
//
//         // This can be downloaded directly:
//         const xhr = new XMLHttpRequest();
//         xhr.responseType = "blob";
//         xhr.onload = (event) => {
//           const blob = xhr.response;
//         };
//         xhr.open("GET", url);
//         xhr.send();
//         console.log("public url  ", url);
//         public_url = url;
//       })
//       .catch((error) => {
//         // Handle any errors
//         console.log("error", error);
//       });
//     return public_url;
//   } catch (e) {
//     console.log("error fetching url", e);
//   }
// };
