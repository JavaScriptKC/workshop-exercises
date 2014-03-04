# Overview

This excercise demonstrates how to process data that requires several http calls to produce the end result.

1. Start by issuing a HTTP GET request to `http://localhost:3000/movies` and receiving a JSON array of movies.
2. For each movie POST a JSON object containing the `id` and `synopsis` to `http://localhost:3000/analyze`. This will respond with a JSON array of recognized named entities in the synopsis.
3. Aggregate the result of all named entities for each movie and POST to `http://localhost:3000/check` with the array of objects containing `id` and `named_entities`.

## Details

### Step 1
The `/movies` endpoint will respond with an Array of JavaScript objects like this: 

```
[
    {
      "id": "771250004",
      "title": "The Hunger Games: Catching Fire",
      "year": 2013,
      "mpaa_rating": "PG-13",
      "runtime": 146,
      "critics_consensus": "Smart, smoothly directed, and enriched with a deeper exploration of the franchise's thought-provoking themes, Catching Fire proves a thoroughly compelling second installment in the Hunger Games series.",
      "release_dates": {
        "theater": "2013-11-22",
        "dvd": "2014-03-07"
      },
      "ratings": {
        "critics_rating": "Certified Fresh",
        "critics_score": 89,
        "audience_rating": "Upright",
        "audience_score": 91
      },
      "synopsis": "THE HUNGER GAMES: CATCHING FIRE begins as Katniss Everdeen has returned home safe after winning the 74th Annual Hunger Games along with fellow tribute Peeta Mellark. Winning means that they must turn around and leave their family and close friends, embarking on a \"Victor's Tour\" of the districts. Along the way Katniss senses that a rebellion is simmering, but the Capitol is still very much in control as President Snow prepares the 75th Annual Hunger Games (The Quarter Quell) - a competition that could change Panem forever. (c) Lionsgate",
      "posters": {
        "thumbnail": "http://content6.flixster.com/movie/11/17/64/11176484_mob.jpg",
        "profile": "http://content6.flixster.com/movie/11/17/64/11176484_pro.jpg",
        "detailed": "http://content6.flixster.com/movie/11/17/64/11176484_det.jpg",
        "original": "http://content6.flixster.com/movie/11/17/64/11176484_ori.jpg"
      },
      "abridged_cast": [
        {
          "name": "Jennifer Lawrence",
          "id": "770800260",
          "characters": [
            "Katniss Everdeen"
          ]
        },
        {
          "name": "Josh Hutcherson",
          "id": "162654356",
          "characters": [
            "Peeta Mellark"
          ]
        },
        {
          "name": "Liam Hemsworth",
          "id": "770833479",
          "characters": [
            "Gale Hawthorne"
          ]
        },
        {
          "name": "Elizabeth Banks",
          "id": "162653584",
          "characters": [
            "Effie Trinket"
          ]
        },
        {
          "name": "Stanley Tucci",
          "id": "162661152",
          "characters": [
            "Caesar Flickerman"
          ]
        }
      ],
      "alternate_ids": {
        "imdb": "1951264"
      },
      "links": {
        "self": "http://api.rottentomatoes.com/api/public/v1.0/movies/771250004.json",
        "alternate": "http://www.rottentomatoes.com/m/the_hunger_games_catching_fire/",
        "cast": "http://api.rottentomatoes.com/api/public/v1.0/movies/771250004/cast.json",
        "clips": "http://api.rottentomatoes.com/api/public/v1.0/movies/771250004/clips.json",
        "reviews": "http://api.rottentomatoes.com/api/public/v1.0/movies/771250004/reviews.json",
        "similar": "http://api.rottentomatoes.com/api/public/v1.0/movies/771250004/similar.json"
      }
    }]
```
### Step 2

Issue a POST request for every object in the JSON movie array. For example the movie above should look like this (note that it's only the `id` and `synopsis` fields):

```
{
   "id": "771250004",
   "synopsis": "THE HUNGER GAMES: CATCHING FIRE begins as Katniss Everdeen has returned home safe after winning the 74th Annual Hunger Games along with fellow tribute Peeta Mellark. Winning means that they must turn around and leave their family and close friends, embarking on a \"Victor's Tour\" of the districts. Along the way Katniss senses that a rebellion is simmering, but the Capitol is still very much in control as President Snow prepares the 75th Annual Hunger Games (The Quarter Quell) - a competition that could change Panem forever. (c) Lionsgate"
}
```

TIP: Make sure to specify the `Content-Type` header with value `application/json`.

### Step 3

POST a JavaScript Array containing the results of Step 2 for verification. Here's an example with just one entry. Make sure to POST every entery.

```
[{ 
   "id": "771250004",
   "named_entities": 
   [  "HUNGER",
      "Katniss Everdeen",
      "Annual Hunger Games",
      "Peeta Mellark",
      "Capitol",
      "Snow",
      "Annual Hunger Games",
      "Panem" ] 
}]
```
