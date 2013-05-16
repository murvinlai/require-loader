require-loader
==============

Dynamically add (require) / delete the modules from specified directory.   [require-loader] is local to the module. 


-------------


It is for requiring some files from a directory.  If there is a change in the directory, such as adding or removing file,
then it will require the new file or remove it from require.cache.

I try to keep it as simple and as less dependent as possible.
