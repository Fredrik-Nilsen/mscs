// This file handles the functionality for the first page, including rendering the matrix of questions, capturing user responses, and navigating to the results page.

document.addEventListener("DOMContentLoaded", function() {
    const questions = [
       "Jeg utsetter kjedelige oppgaver i tjenesten eller studiene til siste liten",
        "Når jeg har rutineoppgaver som bør gjøres (f.eks. puss, vedlikehold eller studiearbeid), gjør jeg meg ferdig med dette før jeg gjør andre og mindre viktige ting",
        "Jeg utsetter forberedelser (f.eks. pakking, studier) så lenge at det går ut over min eller lagets effektivitet",
        "Jeg disponerer tiden min effektivt når vi har forberedelsesfase eller selvstudium",
        "Jeg har vanskelig for å komme i gang med rutinearbeid og tunge oppgaver i felt eller i studiehverdagen",
        "Jeg har lett for å miste fokus eller få tunnelsyn når jeg er sliten eller under press",
        "Jeg klarer å opprettholde situasjonsforståelsen over lengre tid, selv under utmattelse",
        "Jeg klarer å beholde fokus på oppdraget selv når det er mye støy, kaos og friksjon rundt meg",
        "Jeg evner å veksle bevisst mellom detaljfokus og overblikk i en presset situasjon",
        "Jeg har problemer med å holde konsentrasjonen oppe under lange ordrer eller briefinger",
        "Fysisk ubehag (sult, kulde, søvnmangel, etc.) får meg noen ganger til å ta 'ulovlige' snarveier i tjenesten",
        "Jeg lar meg lett styre av umiddelbare behov (f.eks. hvile, varme, mat) i stedet for å prioritere det oppdraget krever der og da",
        "I frustrerende situasjoner sliter jeg med å holde tilbake skarpe kommentarer eller aggresjon overfor andre",
        "Når jeg vet at det finnes en enklere eller mer behagelig løsning, har jeg vanskelig for å slippe tanken på den under krevende oppdrag",
        "Jeg handler ofte overilt under press, uten å vurdere konsekvensene eller andre handlingsalternativer godt nok",
        "Når mismotet brer seg i felt, klarer jeg aktivt å endre tankesett for å opprettholde min egen stridsvilje",
        "Når jeg er mentalt nede under en langvarig operasjon, fokuserer jeg bevisst på lyspunkter eller løsninger",
        "Når motivasjonen er lav, iverksetter jeg bevisst små tiltak (f.eks. bytte sokker, ta en kaffe, støtte en makker) for å hente meg inn igjen",
        "Hvis jeg blir provosert eller sint under oppdragsløsning, klarer jeg raskt å parkere følelsen og re-fokusere på oppdraget",
        "Når jeg får et oppdrag, utarbeider jeg konkrete og systematiske planer for hvordan det skal løses",
        "I ledelse av meg selv, vet jeg nøyaktig hva som må gjøres, når og hvordan",
        "Jeg klarer å holde blikket på sjefens intensjon og det langsiktige målet, selv når jeg står midt i kaoset og detaljene",
        "Jeg har en tydelig forståelse som jeg reflekterer over nærmest daglig, av hvilke personlige og faglige krav som stilles til meg for å bli en god offiser",
        "Når situasjonen er uoversiktlig og retning mangler, er det som regel jeg som tar initiativ for i det minste å få i gang en prosess",
        "Når en plan feiler, evner jeg raskt å tenke nytt og angripe problemet fra en helt annen vinkel",
        "I risikofylte eller skremmende situasjoner bruker jeg mentale teknikker for å kontrollere frykten",
        "Når jeg er fysisk utmattet og gruer meg til neste gjøremål, bruker jeg bevisste teknikker for å 'koble inn gassen' og iverksette handling",
        "Når jeg merker at jeg mister overblikket under press, tar jeg bevisste grep (f.eks. taktisk pust, ta et skritt tilbake) for å øke min egen kognitive kapasitet",
        "Jeg finner ofte nye veier ut av fastlåste situasjoner ved å ta et skritt tilbake og redefinere situasjonen",
        "Jeg har god selvkontroll"
    ];

    const questionsTable = document.getElementById('questionsTable');

    questions.forEach((question, index) => {
        const tr = document.createElement('tr');
        const tdQuestion = document.createElement('td');
        tdQuestion.textContent = `${index + 1}. ${question}`;
        tr.appendChild(tdQuestion);

        for (let i = 1; i <= 7; i++) {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `q${index + 1}`;
            input.value = i;
            td.appendChild(input);
            tr.appendChild(td);
        }

        questionsTable.appendChild(tr);
    });

    // Handle form submission
    const form = document.getElementById('mcsForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Validate that all questions are answered
        let allAnswered = true;
        questions.forEach((_, index) => {
            const radios = document.getElementsByName(`q${index + 1}`);
            const isAnswered = Array.from(radios).some(radio => radio.checked);
            if (!isAnswered) {
                allAnswered = false;
            }
        });

        if (!allAnswered) {
            alert('Vennligst svar på alle spørsmål før du sender inn.');
            return;
        }

        // Collect the form data
        const formData = new FormData(form);
        const results = {};
        formData.forEach((value, key) => {
            results[key] = value;
        });

        console.log(results); // Log the results to the console (or handle them as needed)

        // Store results in localStorage or sessionStorage
        localStorage.setItem('mscsResults', JSON.stringify(results));

        // Redirect to results page
        window.location.href = 'results.html';
    });
});
