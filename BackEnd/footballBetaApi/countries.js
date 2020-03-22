var req = unirest("GET", "https://api-football-beta.p.rapidapi.com/countries");

req.headers({
	"x-rapidapi-host": "api-football-beta.p.rapidapi.com",
	"x-rapidapi-key": "1320ffeacfmsh4ad3a0a2b97c3c8p1ad9f1jsn75c1e160eac6"
});


req.end(function (res) {
	if (res.error) throw new Error(res.error);

	console.log(res.body);
});