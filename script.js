import redirectToAuthCodeFlow from './redirect';
import getAccessToken from './getAccessToken';
import axios from 'axios';


const clientId = "912409609adc4230b391a925c92f9960";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
let matchedTracks = [];
const ACLData = [
  "Dua Lipa", "Tyler, the Creator", "Chris Stapleton", "Blink-182", "Sturgill Simpson", "Pretty Lights", "Khruangbin", "Leon Bridges", "Carin León", "Norah Jones", "Reneé Rapp", 
  "Foster The People", "Kehlani", "Teddy Swims", "Benson Boone", "Caamp", "Dominic Fike", "The Marías", "Jungle", "Dom Dolla", "Chappell Roan", "Porter Robinson", "Fletcher", 
  "Red Clay Strays", "Orville Peck", "Still Woozy", "Vince Staples", "Cannons", "Remi Wolf", "Something Corporate", "Jeezy", "San Holo", "Kevin Abstract", "Stephen Sanchez", 
  "Elderbrook", "Tyla", "Jess Glynne", "Catfish and The Bottlemen", "Hermanos Gutiérrez", "That Mexican OT", "Barry Can't Swim", "Santigold", "Qveen Herby", "Medium Build", 
  "Kenny Beats", "The Beaches", "flipturn", "David Shaw", "Movements", "Royel Otis", "wave to earth (웨이브 투 어스)", "Connor Price", "Malcolm Todd", "Flo", "Bakar", "SPINAL", 
  "Eggy", "Say She She", "MisterWives", "Eyedress", "Elyanna", "Geese", "Grand Funk Railroad", "Mickey Guyton", "Petey", "Dasha", "Mannequin Pussy", "Penny & Sparrow", "Chance Peña", 
  "Sir Chloe", "Dexter and The Moonrocks", "The Paper Kites", "Glass Beams", "BALTHVS", "Dustin Kensrue", "Valencia Grace", "Lola Young", "Joe P", "Myles Smith", "I Dont Know How But They Found Me (iDKHOW)", 
  "Jonah Kagen", "JORDY", "Bob Schneider", "Thee Sinseers", "Goldie Boutilier", "Asleep at the Wheel", "Richy Mitch & The Coal Miners", "Katie Pruitt", "Billy Allen", "The Pollies", "Brittany Davis", 
  "Paco Versailles", "PawPaw Rod", "Nico Vega", "Rett Madison", "WhooKilledKenny", "Tanner Adell", "Emily Nenni", "Emei", "Kalu and the Electric Joint", "The Droptines", "Tyler Halverson", 
  "Mon Rovîa", "The Criticals", "Braxton Keith", "Sawyer Hill", "Jon Muq", "DAIISTAR", "Rickshaw Billie's Burger Patrol", "The Telescreens", "late night drive home", "Théo Lawrence", "Chief Cleopatra", 
  "West 22nd", "Chaparelle", "promqueen", "Being Dead", "Midnight Navy", "Cale Tyson", "Godly The Ruler", "Molecular Steve", "The Tiarras", "Zach Person", "Marley Bleu", "Obed Padilla", "Deyaz", 
  "Amira Elfeky", "The Levites", "The Moriah Sisters", "The Huston-Tillotson University Jazz Collective", "Lucy Kalantari & The Jazz Cats", "Uncle Jumbo", "Q Brothers", "Mister G", "Homescool", 
  "Miss Tutti And The Fruity Band", "Andrew & Polly", "School of Rock", "The Barton Hills Choir"
]

async function init() {
  if (!code) {
    redirectToAuthCodeFlow(clientId);
  } else {
    const accessToken = await getAccessToken(clientId, code); //calling API?
    // const profile = await fetchProfile(accessToken); 
    const tracks = fetchAllSavedTracks(accessToken).then(tracks => {
      console.log("total tracks fetched: ", tracks.length);
      console.log(tracks);
      matchedTracks = crossReferenceData(tracks, ACLData);
      populateUI(matchedTracks);
    })
    
    // console.log(profile);
    // saveTracks(profile);
    // populateUI(profile); //assuming function that will fill fields
  }
}
init();




// async function redirectToAuthCodeFlow(clientId) {
//   //Redirect to spotify authorization page on enter
// }

// async function getAccessToken(clientId, code) {
//   //get access token for code using spotify API
// }

// async function fetchProfile(token) {
//   const result = await fetch("https://api.spotify.com/v1/me/tracks?limit=50", {
//       method: "GET", headers: { Authorization: `Bearer ${token}` }
//   });

//   return await result.json();
// }

async function fetchAllSavedTracks(token) {
  let url = "https://api.spotify.com/v1/me/tracks?limit=50";
  const tracks = [];

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    tracks.push(...response.data.items);
    // while (url) {
    //   const response = await axios.get(url, {
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //       'Content-Type': 'application/json'
    //     }
    //   });
    //   tracks.push(...response.data.items);
    //   url = response.data.next;
    // }
  } catch (error) {
    console.log("Error fetching tracks: ", error);
    return null;
  } 
  return tracks;
}


function crossReferenceData(tracks, ACLData) {
  const matchedTracks = [];

  tracks.forEach(item => {

    //check if artist exists in ACLData
    if (item.track.artists) {
      item.track.artists.forEach(artist => {
        if (ACLData.includes(artist.name)) {
          matchedTracks.push(item.track);
        }
      });
    }
  });
  console.log(matchedTracks);
  return matchedTracks;
}

// function populateUI(profile) {
//   document.getElementById("displayName").innerText = profile.display_name;
//   if (profile.images[0]) {
//       const profileImage = new Image(200, 200);
//       profileImage.src = profile.images[0].url;
//       document.getElementById("avatar").appendChild(profileImage);
//       document.getElementById("imgUrl").innerText = profile.images[0].url;
//   }
//   document.getElementById("id").innerText = profile.id;
//   document.getElementById("email").innerText = profile.email;
//   document.getElementById("uri").innerText = profile.uri;
//   document.getElementById("uri").setAttribute("href", profile.external_urls.spotify);
//   document.getElementById("url").innerText = profile.href;
//   document.getElementById("url").setAttribute("href", profile.href);
// }

function populateUI(matchedTracks) {
  const title = document.querySelector(".tracks");

  matchedTracks.forEach(track => {
    let trackTitle = document.createElement("h3");
    trackTitle.innerText = `${track.name} by ${track.artists[0].name}`;
    title.appendChild(trackTitle);
  })
}

