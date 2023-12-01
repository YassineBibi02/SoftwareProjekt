import React from "react";
import Youtube from "react-youtube";
import gifImage from "./../images/its_a_trap.gif";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

function HereingefallenScreen() {

    const videos = [
        {id: "dQw4w9WgXcQ&ab_channel=RickAstley", title: "Was ist Phishing?"},
        {id: "dQw4w9WgXcQ&ab_channel=RickAstley", title: "Wie erkennt man Phishing?"},
        {id: "dQw4w9WgXcQ&ab_channel=RickAstley", title: "Wie kann man Phishing vermeiden?"}
    ];

    const FontStyle = {
        color: '#333',
        fontSize: '1.2em',
        marginBottom: '15px',
        lineHeight: '1.5'
    }

    const container1 = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '20px'
    }

    const container2 = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: '20px',
        padding: '20px',
        border: '1px solid #ddd',
        borderColor: '#ec6608',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        textAlign: 'left',
        ...FontStyle
    }

    const container3 = {
        display: 'flex',
        flexDirection: 'row',
        margin: '20px',
        justifyContent: 'space-between'
    }

    const HeaderStyle = {
        color: '#ec6608',
        fontSize: '3em',
        marginBottom: '10px',
        fontFamily: 'Arial, sans-serif'
    }

    const FontStyleSmall = {
        color: '#ec6608',
        fontSize: '1em',
        fontStyle: 'italic'
    }

    const FontStyleBig = {
        ...FontStyle,
        fontSize: '1.5'
    }

    const MarginTop = {
        marginTop: '50px'
    }

    const MarginLeft = {
        marginLeft: '50px'
    }

    const VideoOptions = {
        height: '300',
        width: '500'
    }

    const VideoTitle = {
        textAlign: 'center',
        color: '#ec6608',
        fontSize: '1.2em',
        marginBottom: '10px'
    }

    const GifCOntainer = {
        marginTop: '20px',
        display: 'flex',
        alignItems: 'center'
    }

    const GifStyle = {
        maxWidth: '100%',
        maxHeight: '400px',
        margin: 'auto'
    }

    const [username, setUsername] = useState('');                           // State Variable um den Usernamen des Nutzers uebernehmen zu koennen
    const queryParams = new URLSearchParams(window.location.search);
    var user_payload = [queryParams.get("UID"), queryParams.get("MID")];    // Auslesen der Parameter in der URL
    let ignore = false;                 // Boolean zum Umgehen der Doppel-Ausfuehrung von useEffect() im React-Dev-Mode

    useEffect(() => {
        const blameUser = async (user_params) => {
            if(user_params[0] == null || user_params[1] == null) {              // ohne Parameter kann man sich den POST sparen
                console.log("No payload to read from! Did you access the site without UID and/or MID?");
                return
            }
            if(!ignore) {
                try {
                    console.log("Blaming user with UID " + user_params[0] + " for clicking the Link of Mail with MID " + user_params[1] + ".");
                    const response = await axios.post('http://localhost:8080/api/methode/BlameUser', user_params);      // Uebergeben der Parameter an das Java-Backend
                    console.log('Response: ', response.data)
                    setUsername(response.data);             // Java-Backend antwortet mit Namen des Nutzers
                } catch (error) {
                    console.error(error);
                }
            }
        };
        blameUser(user_payload);
        return () => { ignore = true };
    }, []);

    return (
        <div>
            <div style={container1}>
                <h1 style={HeaderStyle}>Du bist hereingefallen!</h1>    
                {/*<p style={FontStyleSmall}>Keine Sorge, das ist nicht echt</p>*/}           
            </div>
            <div style ={GifCOntainer}>
                <img src={gifImage} alt="GIF" style={GifStyle}/>
            </div>
            <div style={container2}>
                <p style = {FontStyleBig}>Hallo {username},</p>
                <p style = {FontStyle}>
                    Du bist auf unsere Fake-Phishing E-Mail hereingefallen. In einem realen Szenario könnte diese Seite dazu dienen, 
                    dich zur Eingabe persönlicher Daten wie deines Passworts oder deiner Kreditkarteninformationen zu verleiten. 
                    Diese sensiblen Informationen würden dann in die Hände von Angreifern gelangen, die sie missbrauchen könnten.
                </p>
                <p style = {FontStyle}>
                    Hier sind einige Tipps um zuküntflich solche Betrügereien zu vermeiden:
                </p>
                <ul>
                    <li style = {MarginLeft}>Überprüfe die E-Mail des Versenders. Sollte diese E-mail wirklich von diesem Versender stammen?</li>
                    <li style = {MarginLeft}>Klicke nicht auf verdächtige Links und lade keine unbekannten Dateien herunter.</li>
                    <li style = {MarginLeft}>Überprüfe die Legitimität einer Website, bevor du dort irgendwelche Daten eingibst.</li>
                </ul>
                <p style={{...FontStyle, ...MarginTop}}>Um dazu mehr zu erfahren, klicke auf den folgenden Link oder schau dir eines der unteren Videos an:</p>
                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley" target="_blank" rel="noopener noreferrer">
                    Weitere Informationen
                </a>
            </div>
            <div style={container3}>
                {videos.map((video) => (
                        <div key={video.id}>
                            <h2 style={VideoTitle}>{video.title}</h2>
                            <Youtube
                                videoID={video.id}
                                opts={VideoOptions}
                                onReady={(event) => event.target.pauseVideo()}
                            />
                        </div>
                    ))}
            </div>
        </div>

    );
}

export default HereingefallenScreen;