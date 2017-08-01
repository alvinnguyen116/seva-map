To add data to the map, please open the 'data' folder and edit the appropriate file(s). Do not change the name of a file as the javascript is dependent on these names. 

<h1>I. Editing Location</h1>
<p> Markers or locations are recorded in the file "locations.json". 

<em>Each data has 7 attributes:
  - keyword
  - image
  - lat
  - lng
  - name
  - type
  - description 
</em>
  
*Keyword is a comma seperated list of words you would like a location to be tagged with. These words should not be case-senstive nor space sensitive, but to be safe, I would try to be as consistent as possible. 

*Image is the location of image you would like to display with the location. <b>(Image dimensions are 225 x 500. If you are going to add an image, I would recommed this specific cropping. Landscape photos would fit best.)</b> 

*Lat is a numeric value for the latitude of a location. 

*Lng is a numeric value for the longitude of a location. 

*Name is the name of a location. Name will be displayed in the info window. 

<em>Type is a predefined category for the three marker types on the map: 
  - sevaMentee
  - sevaPartner
  - sevaOffice
</em>
'Type' is case sensitive, so make sure to be as percise as possible. Every location needs to have exactly one of the seven values above. 
None of these values may be blank as per JSON data regulations. If there is no value, please using double quotes, or an empty string, to indicate there is no value. 
</p>

<h1>II. Changing Legend Description</h1>

Each legend description is in a seperate text file. For example, the mentee's text description is in a file called "seva_mentee.txt". Again, do not change the names of these text files and do not remove the span tag. If you wish to edit the text, only edit the text within the span. There is no limit to how long the description is. You can add html to the these text files if you want to have a special in-line style but it should not be necessary. 

<h1>III. Editing Filter</h1>

To add more filters, edit the file called "map_filters.txt". This is a comma separated list of words that should not be case-sensitive nor space sensitive. Once you add a filter, make sure you also edit the "keyword" category of the locations(s) you wish to appear under this filter. You should use the exact same word as you used in the filter file. There is no limit to how many filters you add or delete. To delete a filter, simply remove that word from the list. However, please be mindful of how many filters you add as the height and width for each filter is pre-set.

<h1> IV. Changing Map Size </h1> 
Map height is constant and can be changed in the Cascading Style Sheet labeled "Map_CSS.css". To change the width, you can either edit the map's width directly or its empty container. I recommend bootstrap's grid system for responsive design.
