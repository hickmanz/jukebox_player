//import { deflate } from 'zlib';
//import { isRegExp } from 'util';

//import { request } from 'https';

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


const serverAddr = 'https://api.zaqify.com:8080/'
var player;
var tokenData;
var player_id;


window.onSpotifyWebPlaybackSDKReady = () => {

    player = new Spotify.Player({
        name: 'Mixer Jukebox',
        getOAuthToken: cb => {
        socket.emit('player-get-token', 'holder', function(data){
            tokenData = data
            var token = tokenData.access_token 
            console.log(token)
            cb(token);

        })
        
        }
    });

    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    // Playback status updates
    player.addListener('player_state_changed', state => { 
      console.log(state);
      if(state == null){
        player.connect().then(success => {
          if (success) {
            console.log('The Web Playback SDK successfully connected to Spotify!');
          }
        })
      }
      socket.emit('player_state_changed', state) 
      console.dir(state)
    });

    // Ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
      socket.emit('player-ready', device_id)
      player_id = device_id
    });
    // Connect to the player!
    player.connect();
};

const $ = require('jquery');

const path = require('path')
const fs = require('fs-extra')
var tmp = require('tmp');
const remote = require('electron').remote; 
const app = remote.app;
const dateFormat = require('dateformat');
//const nav = require('./assets/nav')
const socket = require('socket.io-client')(serverAddr);

socket.on('connect', function(){
  console.log('connected to server')
  player.connect().then(success => {
    if (success) {
      console.log('The Web Playback SDK successfully connected to Spotify!');
    } else {
      console.log('new connect fail')
      socket.emit('player-ready', player_id)

    }
  })

});
socket.on('updateTokenData', function(data){
  console.dir(data)
  tokenData = data
  player.connect().then(success => {
    if (success) {
      console.log('The Web Playback SDK successfully connected to Spotify!');
    }
  })

})
socket.on('set-volume', function(data){
  player.setVolume(data)
})
socket.on('time-check', function(data){
  console.log('time-check')
  player.getCurrentState().then(state => {
    console.dir(state);
    socket.emit('player_state_changed', state) 
  });

})
socket.on('toggle-play', function(){
  player.togglePlay().then(() => {
    console.log('Toggled playback!');
  });
})

socket.on('seek', function(position){
  console.log('scrubb')
  player.seek(position).then(() => {
    console.log('Changed position!');
  });
})

const Datastore = require('nedb');
const db = new Datastore({ filename: path.join('./', 'main.db'), autoload: true, timestampData: true  });

