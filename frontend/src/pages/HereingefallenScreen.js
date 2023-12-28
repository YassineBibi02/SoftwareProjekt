import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import gifImage from "./../images/its_a_trap.gif";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

function HereingefallenScreen() {

    const FontStyle = {
        color: '#333',
        fontSize: '1.2em',
        marginBottom: '15px',
        lineHeight: '1.5'
    }

    const container1 = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        margin: '150px',
        maxHeight: '10px'
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
        ...FontStyle,
    }

    const container3 = {
        display: 'flex',
        flexDirection: 'row',
        margin: '20px',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    }

    const HeaderStyle = {
        color: '#ec6608',
        fontSize: '6em',
        marginBottom: '10px',
        fontFamily: 'Arial, sans-serif'
    }

    const FontStyleBig = {
        ...FontStyle,
        fontSize: '1.5em'
    }

    const MarginTop = {
        marginTop: '50px'
    }

    const MarginLeft = {
        marginLeft: '50px'
    }

    const VideoContainer ={
        flex: '0 0 calc(50% - 10px)',
        marginBottom: '20px'
    }

    const VideoTitle = {
        textAlign: 'center',
        color: '#ec6608',
        fontSize: '1.2em',
        marginBottom: '10px'
    }

    const GifCOntainer = {
        marginTop: '20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
    }

    const GifStyle = {
        maxWidth: '100%',
        maxHeight: '400px',
        margin: 'auto'
    }

    const LinkStyle = {
        fontSize: '1.5em',
        display: 'inline-block',
        textDecoration: 'underline',
        color: '#ec6608'
    }

    const videos = [
        {title: "Was ist Phishing?", url:"https://www.youtube.com/embed/DPjb0YWQXyo?si=BXq2RN6Frmy_7y21"},
        {title: "Wie erkennt man Phishing?", url:"https://www.youtube.com/embed/XgF42Jb8jxo?si=u9BJL4M46INHLGNa"},
    ];

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
                <div>
                    <h1 style={HeaderStyle}>Du bist hereingefallen!</h1>  
                </div> 
                <div style ={GifCOntainer}>
                    <img src={gifImage} alt="GIF" style={GifStyle}/>
                </div>          
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
                <p style={{...FontStyle, ...MarginTop}}>Um dazu mehr zu erfahren, schau dir eines der unteren Videos an.</p>
                <p style={{...FontStyle}}>Vergiss auch nicht unsere zahlreichen Schulungen anzuschauen und dein Wissen mit den dazugehörigen Quizzes zu testen!</p>
                <div>
                    <Link style={LinkStyle} to="/lessonsOverview">
                            Zu den Schulungen
                    </Link>
                </div>
            </div>
            <div style={container3}>
                {videos.map((video, index) => (
                    <div key={index} style={VideoContainer}>
                        <h2 style={VideoTitle}>{video.title}</h2>
                        <div className="ratio ratio-16x9">
                            <iframe
                                src={video.url}
                                title={video.title}
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
}

export default HereingefallenScreen;