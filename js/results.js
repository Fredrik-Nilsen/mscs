// This file processes the responses from the test, applies the reversal logic for specific questions, calculates the averages for each category, and displays the summarized results on the results page.

document.addEventListener("DOMContentLoaded", function() {
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsChart = document.getElementById('resultsChart').getContext('2d');
    const results = JSON.parse(localStorage.getItem('mscsResults'));

    if (results) {
        // Spørsmål som skal snus (reverseres) før utregning
        const reversedQuestions = [1, 3, 5, 6, 10, 11, 12, 13, 14, 15];
        const reverseValue = value => 8 - value; // Reversering: 1=7, 2=6, 3=5, 4=4, 5=3, 6=2, 7=1

        // Kategoriene fra MSCS-O i eksakt rekkefølge
        const categories = {
            "Fravær av prokrastinering": [1, 2, 3, 4, 5],
            "Oppmerksomhetskontroll": [6, 7, 8, 9, 10],
            "Impulskontroll": [11, 12, 13, 14, 15],
            "Emosjonell kontroll": [16, 17, 18, 19],
            "Målorientering": [20, 21, 22, 23],
            "Selvkontroll strategier": [24, 25, 26, 27, 28, 29],
            "Inhibering (Brems)": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            "Initiering (Gass)": [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
            "Generell selvkontroll": Array.from({ length: 29 }, (_, i) => i + 1),
        };

        // Funksjon for å regne ut gjennomsnitt
        const calculateAverage = (questions) => {
            const total = questions.reduce((sum, q) => {
                const value = parseInt(results[`q${q}`], 10);
                return sum + (reversedQuestions.includes(q) ? reverseValue(value) : value);
            }, 0);
            return (total / questions.length).toFixed(2);
        };

        const categoryAverages = {};
        for (const [category, questions] of Object.entries(categories)) {
            categoryAverages[category] = calculateAverage(questions);
        }

        // Vise resultatene som en liste
        const ul = document.createElement('ul');
        for (const [category, average] of Object.entries(categoryAverages)) {
            const li = document.createElement('li');
            li.textContent = `${category}: ${average}`;
            ul.appendChild(li);
        }
        resultsContainer.appendChild(ul);

        // Hent ut rekkefølgen på kategoriene
        const categoriesList = Object.keys(categoryAverages);

        // Definere farger for grafen basert på gruppering (3 + 3 + 2 + 1)
        const backgroundColors = categoriesList.map((category, index) => {
            if (index < 3) {
                return 'rgba(255, 99, 132, 0.6)'; // De 3 første (Rødlig)
            } else if (index < 6) {
                return 'rgba(75, 192, 192, 0.6)'; // De 3 neste (Grønnlig)
            } else if (index < 8) {
                return 'rgba(54, 162, 235, 0.6)'; // De 2 neste (Mørkeblå)
            } else {
                return 'rgba(153, 102, 255, 0.8)'; // Den siste (Lilla/helt annen farge)
            }
        });

        const borderColors = categoriesList.map((category, index) => {
            if (index < 3) {
                return 'rgba(255, 99, 132, 1)'; 
            } else if (index < 6) {
                return 'rgba(75, 192, 192, 1)'; 
            } else if (index < 8) {
                return 'rgba(54, 162, 235, 1)'; 
            } else {
                return 'rgba(153, 102, 255, 1)'; 
            }
        });

        // Opprette grafen med Chart.js
        new Chart(resultsChart, {
            type: 'bar',
            data: {
                labels: categoriesList,
                datasets: [{
                    label: 'Gjennomsnittlig skår',
                    data: Object.values(categoryAverages),
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 7
                    }
                }
            }
        });

        // ==========================================
        // SEND DATA TIL GOOGLE SHEETS DASHBOARD
        // ==========================================
        
        // Sjekk at vi ikke allerede har sendt denne dataen (hindrer dobbeltsending ved F5/oppdatering)
        if (!sessionStorage.getItem('dataSendt')) {
            
            // Samle alle data i en pakke (rådata + utregnede snitt)
            const uttrekk = {
                DatoTid: new Date().toISOString(),
                ...results, 
                ...categoryAverages 
            };

            // Din Google Apps Script Webhook URL
            const googleAppScriptURL = "https://script.google.com/macros/s/AKfycbxAhzMzJ5Ej5NfBohu2nC5SQdYOdM0d0ZQIfv5NgoogAhPRdVCBQZxcu34GqtwJHLaYeQ/exec"; 

            fetch(googleAppScriptURL, {
                method: 'POST',
                mode: 'no-cors', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(uttrekk)
            })
            .then(() => {
                console.log("Samband opprettet: Resultater sendt til dashboard!");
                sessionStorage.setItem('dataSendt', 'true'); 
            })
            .catch((error) => {
                console.error("Sambandsbrudd ved sending av data:", error);
            });
        }

    } else {
        resultsContainer.textContent = 'Ingen resultater funnet. Vennligst ta testen først.';
    }
});