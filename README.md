require-loader
==============

Watch the specified directory and dynamically add/remove module when there is any change.   [require-loader] is local to the module. 


-------------


## Purpose
To allow dynamically add / remove module in a simple way. 
When new file is put into the directory, it uses "require()" to add module as usual, and it can be referenced in the [require-loader] map. 
When file is removed from the directory, it will be removed from require.cache and the [require-loader] map. 

[require-loader] is local to the module implementing it.  Therefore you can set up require-loader in 'test-a.js' and 'test-b.js' watching on different directories, and not interferring each other.


## Installation


## Quick Start


## Features & Options



## Use cases



