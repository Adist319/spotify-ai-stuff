/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [
        'i.scdn.co',           // Spotify's main image CDN
        'mosaic.scdn.co',      // Spotify's mosaic image CDN
        'platform-lookaside.fbsbx.com',  // Facebook CDN (sometimes used by Spotify)
        't.scdn.co',           // Spotify's thumbnail CDN
        'lineup-images.scdn.co', // Spotify's lineup images
        'blend-playlist-covers.spotifycdn.com', // Spotify's blend playlist covers
        'wrapped-images.spotifycdn.com', // Spotify's wrapped images
      ],
    },
  };
  
  export default nextConfig;