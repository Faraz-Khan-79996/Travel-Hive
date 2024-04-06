### Sending request other than POST or GET directly from html `<form>`

use `method-override` library to do it.

```apache
<form method="POST" action="/listings/<%= listing._id %>?_method=PUT">
```

```apache
const methodOverride = require('method-override')
app.use(methodOverride("_method"))
```

in the HTML, use method "POST" and add a query string  `_method="your header"`

### Directly creating an `<input>` fields 'name' part of an object in `<form>`

```apache
<input name="listing[image]" value="<%= listing.image %>" type="text" />
```

now the 'image' will be part of listing object. You can access it using `req.body.listing `

### Using `ejs-mate`

```apache
const ejsMate=require('ejs-mate')
```

```apache
app.set('view engine' , 'ejs')
app.set('views' , path.join(__dirname , 'views'))
app.engine('ejs' , ejsMate)
```

You can create boilerplate code, inside it you can add `<%- body %>` . Now you can add it as layout to your other pages at top. All the code will then go inside that `body` .

`<%layout('layouts/boilerplate') %>` path is the path from views folder.

##### When you use `<includes(path))>` path is relative to the place you're in, not directly from views.

### Form validation

#### On frontend using bootstrap

add `novalidate ` attribute to the `<form>` and add a class `needs-validation`.

add the script which is given in doc.

#### On backend using `joi` library

Before saving the incoming data to mongodb, we validate that data using a library **`joi`.**

1. Create a schema using joi similar to your mongoose schema.
2. Create a middleware which takes your form data.
3. Use validate method and pass your data as object.
4. If there is error in response, handle error else next().

# Misc

from out edit and create forms, we're sending a listing object directly from `<form>` by

```apache
<input name="listing[image]" value="<%= listing.image %>" type="text" />
```

you don't have to take out each input value in the backend using their name. simply take out `listing `object from `req.body`
