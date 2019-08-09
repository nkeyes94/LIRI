const axios = require("axios");
const inquirer = require("inquirer");
let moment = require("moment");
let fs = require("fs");
var Spotify = require("node-spotify-api");

 var spotKey  = {
    id: "9c21a47c99ca46fd96931fae2b9a444d",
    secret: "b24762babaab4c41b241b2ae2d3e038d"
};

let spotify = new Spotify(spotKey);

inquirer.prompt([
    {
        type: "input",
        message: "Hello, what is your name?",
        name: "name"
    }
]).then(function(res){
    console.log("Hello, "+ res.name+"!");
    console.log("\n");
    inquirer.prompt([
        {
            type: "list",
            message: "Please select a function",
            choices: ["Concert This", "Spotify This", "Movie This"],
            name: "choice"
        }
    ]).then(function(res){
        if(res.choice === "Concert This"){
            //Logic for band in town
            console.log("You have selected " + res.choice)
            //Inquirer for the band name
            inquirer.prompt([
                {
                    type: "input",
                    message: "Please enter a band name to check tour dates",
                    name: "bandname"
                }
            ]).then(function(res){
                //Console logging band name
                console.log("Searching concerts for: "+ res.bandname);
                let band = res.bandname;
                //API Call to search for the band
                let query = "https://rest.bandsintown.com/artists/" + res.bandname + "/events?app_id=codingbootcamp";
                //Invalid if the string is empty
                if(res.artist == ""){
                    console.log("Invalid");
                } else {
                    //Pulling data from the API (Date, Band, Venue, Location, etc)
                    axios.get(query).then(
                        function(response){
                            for(let i = 0; i < response.data.length; i++){
                                let date = moment(response.data[i].datetime).format('MM/DD/YYYY');
                                console.log("-----------------------")
                                console.log("Here are your results: ");
                                console.log("Band: "+ res.bandname);
                                console.log("Date: "+ date);
                                console.log("Location: "+ response.data[i].venue.country);
                                console.log("Venue: "+ response.data[i].venue.name);
                                console.log("-----------------------");
                            }
                            //Logging the results to the file
                            fs.appendFile("log.txt", 'Band: ${band}', function(err){
                                if(err) {
                                    console.log(err);
                                } else {
                                    console.log("Log file updated!");
                                }
                            })
                        }
                    )
                }
            })

        }else if(res.choice === "Spotify This"){
            //Logic for spotify
            console.log("You have selected "+ res.choice);

            inquirer.prompt([
                {
                    type: "input",
                    message: "Please enter a song name",
                    name: "songname"
                }
            ]).then(function(res){
                console.log("Searching song names for: "+ res.songname);

                //If the string is empty, invalid
                if(res.songname == ""){
                    console.log("Invalid. Please try again.");
                } else {
                    spotify.search({ type: 'track', query: res.songname }).then(function(response){
                        console.log("--------------------");
                        console.log("Song: "+ response.tracks.items[7].name);
                        console.log("Artist: "+ response.tracks.items[7].album.artists[0].name);
                        console.log("Album: "+ response.tracks.items[7].album.name);
                        console.log("Released: "+ response.tracks.items[7].album.release_date);
                        console.log("---------------------");
                    })
                }
                //Logging results
                fs.appendFile("log.txt", "Song: "+ res.songname, function(err){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("Log file updated!");
                    }
                });
                
            })
        }else if(res.choice === "Movie This"){
            //Logic for ombd
            console.log("You have selected "+ res.choice);

            inquirer.prompt([
                {
                    type: "input",
                    message: "Please enter a movie title to search for",
                    name: "moviename"
                }
            ]).then(function(res){
                console.log("Searching for movies with the title: "+ res.moviename);

                if(res.moviename == ""){
                    console.log("Invalid. Please try again");
                } else {
                    axios.get("http://www.omdbapi.com/?t="+ res.moviename +"&y=&plot=short&apikey=trilogy").then(function(response){
                        console.log("----------------");
                        console.log("Title: "+ response.data.Title);
                        console.log("Year released: "+ response.data.Year);
                        console.log("Rating (IMDB): "+ response.data.imdbRating);
                        console.log("Actors: "+ response.data.Actors);
                        console.log("Plot: "+ response.data.Plot);
                        console.log("----------------");
                    })
                }
                //Append to log
                fs.appendFile("log.txt", "Movie: "+ res.moviename, function(err){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("Log updated!");
                    }
                })
            })
        }
    })
});