Check out the github pages here: <a href="https://alvinnguyen116.github.io/seva-map/" target="_blank"> Seva Map </a> </br>
Check out the live website here: <a href="http://www.seva.org/site/PageServer?pagename=programs/prevent_blindness&_ga=2.77450645.182892957.1501700893-359267843.1484544530" target="_blank"> Where We Work </a> </br>
<hr>
This project is a collaboration with the Seva Foundation office in Berkeley. I got involved by interning for the Summer and it was a great learning experience for me. If you want to get involved(doesn't have to be in the front-end), check out more opportunities here: <a href="http://www.seva.org/site/PageServer?pagename=getinvolved/volunteer#.WYIkUYgrLIV" target='_blank'> Seva Opportunities</a>
<hr>
To add data to the map, please open the 'data' folder and edit the appropriate file(s). Do not change the name of a file as the JS is name-dependent.

<h1>I. Editing Location</h1>
<p> Markers are recorded in the file "locations.json". 

Each data has 7 attributes:
  - keyword
  - image
  - lat
  - lng
  - name
  - type
  - description 
  
*Keyword is a comma seperated list of words you would like a location to be tagged with. These words should not be case-senstive nor space sensitive, but to be safe, I would try to be as consistent as possible. 

*Image is the location of image you would like to display with the location. <b>(The container dimensions for images are pre-set to 225 x 500 pixels. If this doesn't work for you, you can change the width and height manually.)</b> 

*Lat is a numeric value for the latitude of a location. 

*Lng is a numeric value for the longitude of a location. 

*Name is the name of a location. Name will be displayed in the info window. 

Type is a predefined category for the three marker types on the map: 
  - sevaMentee
  - sevaPartner
  - sevaOffice

'Type' is case sensitive, so make sure to be as percise as possible. Every location needs to have exactly one of the seven values above. 
None of these values may be blank as per JSON data regulations. If there is no value, please using double quotes(empty String) to indicate there is no value. 
</p>

<h1>II. Changing Legend Description</h1>

Each legend description is in a seperate text file. For example, the mentee's text description is in a file called "seva_mentee.txt". Again, do not change the names of these text files and do not remove the span tag. If you wish to edit the text, only edit the text within the span. There is no limit to how long the description is. You can add html to the these text files if you want to have a special in-line style but it should not be necessary. 

<h1>III. Editing Filter</h1>

To add more filters, edit the file called "map_filters.txt". This is a comma separated list of keywords. Once you add a filter, make sure you also edit the "keyword" category of the locations(s) you wish to appear under this filter. You should use the exact same word as you used in the filter file. There is no limit to how many filters you add or delete. To delete a filter, simply remove that word from the list. However, please be mindful of how many filters you add as the height and width for each filter is pre-set.
<hr>
That should cover the basics of using this map. Read the comments in the code to see how I implemented this map. I cited several sources in the code which made working with JSON data much easier. Also check out the google map API documentation for how to get started and the inner workings of the map: https://developers.google.com/maps/documentation/ 
This project was initiated by the Seva Foundation to improve the now deprecated google MyMaps. We didn't like how the MyMaps algorithm would randomly add pictures and unnecessary information to each info window. The key goals in this projects were the following: 
  -marker clustering 
  -obvious legend 
  -custom images 
  -filter capability 
This map project started in May and ended in August 2017. Design decisions were influenced by Adam Chew, the web master, and the programs team.
<hr>
If you have any questions or concerns, feel free to shoot me an email: alvinnguyen116@gmail.com 

<b><em>Happy Mapping!</em></b> 


