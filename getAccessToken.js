export default async function getAccessToken(clientId, code) {
  const verifier = localStorage.getItem("verifier");
  const redirectUri = window.location.hostname === 'localhost' 
  ? 'http://localhost:5173/callback' 
  : 'https://spotify-profile-demo.netlify.app/callback';

  console.log('redirectUri in accesstoken is',redirectUri);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectUri);
  params.append("code_verifier", verifier);

  const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
  });

  const { access_token } = await result.json();
  return access_token;
}