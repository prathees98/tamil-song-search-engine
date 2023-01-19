Elastic Stack:

Elastic Stack is a group of open source products from Elastic, designed to help users to take data from any type of source and in any format and search, analyze, and visualize that data in real-time.

Elasticsearch is a RESTful distributed search engine. It is Java-based and can search and index document files in diverse formats.
Kibana is an open-source data visualization and exploration tool that is specialized for large volumes of streaming and real-time data. The software makes huge and complex data streams more easily and quickly understandable through its graphic representation.
And there are a couple of other products; logstash and Beats. The intention of the blog is to guide the readers through configuring a very simple song lyrics search engine, especially for Tamil(Thamizh) using ElasticSearch.

Prerequisites:
SongLyrics Corpus → Lyrics data that needed to be added
Postman → Testing API calls

ElasticSearch → Search Engine with API

Sample Lyric Search Engine → Contains lyricsdata, UI [HTML/CSS] , and python scripts for backend support with FLASK

Steps to Follow:
Data Scraping
Before building the lyric search engine, has to collect lyric data. www.tamilpaa.com is a website that has a collection of lyrics organized by movie names, singers, and music directors. And the necessity of Tamil Lyrics and the amount of data (3200+ lyrics scrapable) had necessitated the usage of a particular website as the host for the crawler.
Had written a web crawler using scrapy and scraped raw data from the website. The crawler is a colab notebook availble in the repo.

  
PreProcessedData : The data has to be pre-processed(convert to Tamil) for values of some fields were in English(E.g. A.R.Rahman => A. R. ரஹ்மான்)
  
ModifiedData : The data was modified by adding more fields to spice up search ("வகை","நுகர்ச்சி","மதிப்பீடு") -('genre','views','ratings')
Configuring ElasticSearch

Step-1
Download ElasticSearch which is available in various formats inclusive of ZIP and TAR.GZ formats and unzip the folder. Open a command-line tool and traverse into the bin folder of elasticsearch and then run “elasticsearch” command.

C:\Users\cvvin>cd C:\Users\cvvin\Desktop\Notes\elasticsearch-7.7.1\bin
C:\Users\cvvin\Desktop\elasticsearch-7.7.1\bin>elasticsearch
The ‘elasticsearch’ command will host elasticsearch in localhost. The default port is 9200.

Step-2
Open up a web browser and paste the following URL to check whether elasticsearch search server is up and running.

http://localhost:9200/



Note that the default port is 9200 and can be altered. Traverse to the config folder in elastic search. Open the ‘config.yml’ file and edit the port number as preferred.

http.port: 9300
Step-3
Download Postman if you haven't. Postman is a specialized tool to test RESTful API developed by others or your self.

Step-4
Elasticsearch is similar to a database. Following is an analogy comparing ElasticSearch to more generic relational databases.
Elastic Search => Mysql
Index => Database
Types => Tables
Properties => Columns
Documents => Rows

An index is like a set of keys that implicitly has pointers towards the terms in the search query. An index will consist of one or more Documents. ElasticSearch uses an inverted index, which inverts a page-centric data structure to a keyword-centric data structure.
We can create the Index using the PUT request. Here I have chosen ‘tamilsonglyricsdatabase’ as the index name.
http://localhost:9200/tamilsonglyricsdatabase

And the response will be similar to what is in the figure above(Fig.3). If the index already exists in ElasticSearch, the server will throw an error referring the existing index.

Step-5
We can now create types (i.e. Tables in Database) and add documents(i.e data) using a POST request. The document is the unit of search and index and consists of one or more fields.

I chose “lyrics” as the type of document and “2” as the document ID. Add lyric data as JSON to the body part of the POST request as shown in the figure below(Fi.4.|left). You can get the lyric data from the corpus.
http://localhost:9200/tamilsonglyrics/lyrics/2



One can verify the successful addition of the document from the response if the response to an addition of document is seen as in Fig.4.(right)
But manually adding several JSONs as such will be a hectic task and costly. Hence Elastic Search has aided with “BULK API” where we can add a huge set of documents in one API call.
To add documents thorough BulkAPI, there is a need to convert all individual JSONs that I had collected by scraping websites, to a single BulkJSON. Here (year 2017,2018,2019) you can find three of such BulkJSONs. But it was required to add a small Python script to do a modification that is required to be made to the data I collected and used python to do the addition of data through BulkAPI.
Has to add elasticsearch, elasticsearch_dsl to the current python interpreter.
pip install elasticsearch
pip install elasticsearch-dsl
Once you have added the libraries now can run the python script.

If you have cloned the repo and preferring to try things out, just run bulkdata.py. Else if you have your own data and own manipulations in reading the file and adding any character replacements, try modifying the script below. Index creation, addition of documents and search also can be done with python and elasticsearch library.


bulkdata.py obtainable from author’s github
Get the python script ‘bulkdata.py’ to add an index (uncomment indexing part if not added earlier). And add documents to BulkAPI by running the script. Modify the “index” name to suit your one and run the python script. Add data to a folder (Eg.corpus)and update the path in read_all_songs() method. If you want to add more documents, add them to the same folder and run the script. For the data scraped, I have defined the fields accordingly. But in case of any alterations you have added to the data, add same fields in genData() method.
With these steps, we will be able to successfully upload the data and can search for song lyrics.

Advanced Indexing
But additionally, you can set up existing analyzers or customized analyzers to support more efficient indexing. Have to create a custom analyzer that combines the appropriate character filters, tokenizer, and token filters.


A character filter receives the original text as a stream of characters and can transform the stream by adding, removing, or changing characters.

A tokenizer receives a stream of characters, breaks it up into individual tokens (usually individual words), and outputs a stream of tokens.

Token filters accept a stream of tokens from a tokenizer and can modify tokens (eg lowercasing), delete tokens (eg remove stopwords) or add tokens (eg synonyms).

I have created a custom analyzer and you can get it from here. And traverse to config folder of ElasticSearch in your machine.

elasticsearch-7.7.1\config
Create a folder named “analyze” and add the files you forked from the repo.
elasticsearch-7.7.1\config\analyze\
The custom analyzer comprises of

1. Standard tokenizer → It divides text into terms on word boundaries and removes most punctuation symbols.It is the most referred tokenizers for any language. Hence we stick to this tokenizer.

2. Custom filters that includes

Custom stopper → That has stopwords for Tamil(Like:ஒரு, என்று, மற்றும், இந்த, இது, என்ற, கொண்டு ) which are very frequent in Thamizh and yet can be omitted in search as they usually don not provide any specific meaning to the search.

Custom Stems → Stemming is providing the stems of the words . For example in English we can stem ‘playing,played,player’ → play. Usually steaming can be done with verbs. In Thamizh too we can stem. For example, “உண்ண , உண்டு, உண்டேன் , உண்கிறேன் , உண்பேன் , உண்ணும்” → உண்

Custom Anonymous → Anonymous words can be added so that we can reduce the number of varied indexes and hence can boost efficient indexing and searching.For example, “மிகச்சிறந்த, மிகசிறந்த,மிகவும்சிறப்பான, சிறப்பான, தலைசிறந்த, உயர்ந்த” → சிறந்த

After adding the ‘analyzer’ folder (which incorporates stem.txt, stopwords.txt, synonym.txt) need to create (new) index inclusive of following sample JSON as the body.


Sample Search Queries
We have seen adding documents, adding bulk data, adding custom analyzers, and now we can proceed to search queries. The following examples can be tried with Postman.

Fundamental Search — A user can just search without any required information added to the body of the search GET request.
http://localhost:9200/tamilsonglyrics/_search
A user can search for lyrics if he just knows the movie/ year/ singer/ lyricist/ genre. Add the code snippet below as a body to the Postman GET request. In the example provided, யுகபாரதி is a lyricist and wanted to retrieve lyrics written by him. We can search for lyrics from a particular movie by mentioning the name of movie in the query. We can search for lyrics in a genre just by a mentioning specific genre in query.
E.g.- “யுகபாரதி”

{
    "query": {
        "query_string": {
            "query":"யுகபாரதி"
        }
    }
}


A user can search lyrics specifying the field when he knows the movie/ year/ singer/ lyricist/genre as opposed to wide search mentioned above. This is a match query. Here பாடலாசிரியர்(lyricist) is the field pertaining to யுகபாரதிthe search term the user is searching for. This kind of search will reduce the overhead of searching for the query terms in every field as opposed to searches in specific field. This will improve the duration of search.
E.g.- “பாடலாசிரியர் யுகபாரதி”

{
     "query" : {
          "match" : {
             "பாடலாசிரியர்" : "யுகபாரதி"
         }
     }
 }
Wildcard queries help users to search even with spelling errors. When a user is not sure about the full name of the lyricist யுகபாரதி , he can use யுக* to search as a wildcard. ElasticSearch will bring results with high scores that matches the wildcard.
E.g.- “யுக*” for “யுகபாரதி”

"query" : {
         "match" : {
            "பாடலாசிரியர்" : "யுக*"
        }
    }
}
multi_match query allows searches for a term in more than one specific field. Here அனிருத் is expected to be present in one of the fields or both of பாடியவர்கள்(singers) and இசையமைப்பாளர்(Music director)
E.g.- “அனிருத்”

{
      "query" : {
         "multi_match" : {
             "query" : "அனிருத்",
             "fields": ["பாடியவர்கள்","இசையமைப்பாளர்"]
         }
     }
}


Bool queries is used to reduce the search space with much more added conditions like must,should,must_not which are parallel to the booleans od AND, OR, NOT. In the following search query we expect the results to include இமான் as இசையமைப்பாளர்(musicdirector) and 2019 as the வருடம்(year)
E.g.- இமான் 2019 பாடல்வரிகள்

{
 "query": {
   "bool": {
         "must": [
             { "match": { "இசையமைப்பாளர்": "AR Rahman" }},
             { "match": { "வருடம்": "2019" }}
         ]
       }
     }
   
}
Range Query is helpful in searches where we need results that includes terms within a provided range. Here, when the search is made சமீபத்திய பாடல்கள் (latest songs0 ,we define the latest to be based on the year and defined the range query. gte marks the beginning of the range.
E.g.- இமான் சமீபத்திய பாடல்கள்

"query": {
    "bool": {
      "must": [{
          "match": {
            "இசையமைப்பாளர்": "AR Rahman"
          }
        },
        {
          "range": {
            "வருடம்" : {
                "gte" : "2019"
            }
          }
        }
      ]
    }
  }
}

We can search for other details pertaining to lyrics. MLT(more_like_this) queries are helpful in text mining and hence extend the support a huge search input terms and bring the relevant documents.
{
    "query":{
       "more_like_this":{
          "fields":[
             "பாடல்வரிகள்"
          ],
          "like":"நெஞ்சில் மாமழை நெஞ்சில் மாமழை தந்து வானம் கூத்தாட கொஞ்சும் தாமரை கொஞ்சும் தாமரை வந்து எங்கும் பூத்தாட    எத்தனை நாள் எத்தனை நாள் பார்ப்பது எட்டி நின்று எட்டி நின்று காய்வது கள்ள குரல் பாடல் உள்ளே ஓடுது கண்மூடி கண்மூடி காதோரம் பாடுது    நெஞ்சில் மாமழை நெஞ்சில் மாமழை தந்து வானம் கூத்தாட கொஞ்சும் தாமரை கொஞ்சும் தாமரை வந்து எங்கும் பூத்தாட   வாரத்தில் எத்தனை நாள் பார்ப்பது அன்றாடம் வந்து பார்க்க ஏங்குது வராமல் போகும் நாட்கள் வீண் என வம்பாக சண்டை போட வைக்குது   சொல்ல போனால் என் நாட்களை வண்ணம் பூசி .",
          "min_term_freq":1,
          "max_query_terms":20
       }
    }
  }
A user can do aggregated bucket querying with terms.
The aggregations framework helps to build complex summaries of the data and analytic information over a set of documents. Bucketing, Metric, Matrix,Pipeline are type of aggregations. Bucketing is used to build buckets where each bucket is associated with a key and a document criteria.Once executed will provide list of buckets and a summary of documents that falls into the bucket.

But, before this, we have to add the particular field we want to do bucketing as a field data as shown in Fig.8. Though naturally fields are indexed, sorting, aggregations requires a different access pattern from search.
Search → “Which documents contain this term?”

Sorting and aggregations → “What is the value of this field for this document?”.

Field data is disabled on fields by default as it would take a huge space and manually we need to enable for specific fields.


After adding வகை(genre) as a field data, we can do bucketing. The result of this aggregated bucketing is based on genre. That means the buckets will be created upon genres and summarize documents falls in each bucket/genre.

"aggs": {
   "ratings": {
     "terms": { "field": "வகை" }
   }
 }
}