document.addEventListener("DOMContentLoaded", function () {
    const userNameInput = document.querySelector("#user-input");
    const searchBtn = document.querySelector("#search-btn");
    const stats = document.querySelector("#stats");
    const easyCircle = document.querySelector(".easy-progress");
    const medCircle = document.querySelector(".med-progress");
    const hardCircle = document.querySelector(".hard-progress");
    const easyLabel = document.querySelector("#easy-label");
    const medLabel = document.querySelector("#med-label");
    const hardLabel = document.querySelector("#hard-label");
    const statsCard = document.querySelector("#stats-card");

    function validateUserName(username) {
        if (username.trim() === "") {
            alert("username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/;
        const isMatching = regex.test(username);
        if (!username) {
            alert("invalid username");
        }
        return isMatching;
    }



    async function fetchUserDetails(username) {
        try {
            searchBtn.textContent = "Searching...";
            searchBtn.disabled = true;
            //statsContainer.classList.add("hidden");

            // const response = await fetch(url);
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
            const targetUrl = 'https://leetcode.com/graphql/';

            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/json");

            const graphql = JSON.stringify({
                query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                variables: { "username": `${username}` }
            })
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
            };

            const response = await fetch(proxyUrl + targetUrl, requestOptions);
            if (!response.ok) {
                throw new Error("Unable to fetch the User details");
            }
            const parsedData = await response.json();
            console.log("Logging data: ", parsedData);

            displayUserData(parsedData);
        }
        catch (error) {
            stats.innerHTML = `<p>${error.message}</p>`
        }
        finally {
            searchBtn.textContent = "Search";
            searchBtn.disabled = false;
        }
    }


    function displayUserData(parsedData) {
        const totalQ = parsedData.data.allQuestionsCount[0].count;
        console.log("entered displayUserData")
        const totalHardQ = parsedData.data.allQuestionsCount[3].count;
        const totalMedQ = parsedData.data.allQuestionsCount[2].count;
        const totalEasyQ = parsedData.data.allQuestionsCount[1].count;
        console.log(totalEasyQ);
        console.log(totalMedQ)
        console.log(totalHardQ);
        const solvedTotalQ = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedTotalEasyQ = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedTotalMedQ = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedTotalHardQ = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

        console.log(solvedTotalEasyQ);
        console.log(solvedTotalMedQ);
        console.log(solvedTotalHardQ);

        updateProgress(solvedTotalEasyQ, totalEasyQ, easyLabel, easyCircle);
        updateProgress(solvedTotalMedQ, totalMedQ, medLabel, medCircle);
        updateProgress(solvedTotalHardQ, totalHardQ, hardLabel, hardCircle);


        const cardsData = [
            { label: "Overall Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions },
            { label: "Overall Easy Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions },
            { label: "Overall Medium Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions },
            { label: "Overall Hard Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions },
        ];
        console.log("card ka data: ", cardsData);

        statsCard.innerHTML = cardsData.map(
            data => `<div class="card">
                <h3>${data.label}:</h3>
                <p>${data.value}</p>
                </div>`
        ).join("")
    }



    function updateProgress(solved, total, label, circle) {
        console.log("entered update pogress");
        const progressDegree = (solved / total) * 100;
        console.log(progressDegree);
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    searchBtn.addEventListener('click', function () {
        const userName = userNameInput.value;
        console.log("searchimg btn");
        console.log("login username: ", userName);
        if (validateUserName(userName)) {
            fetchUserDetails(userName);
        }
    })

})