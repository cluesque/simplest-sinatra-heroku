# The Simplest Possible Web Application, with sinatra and heroku #

Here's one take on building the simplest possible web application with [sinatra](http://www.sinatrarb.com), and deploying it with [heroku](http://www.heroku.com/).

A web application is a program that lives somewhere on the internet, responding to http requests presented to it.  I set out to play with one set of easiest possible tools.

The end result project is on [github](https://github.com/cluesque/simplest-sinatra-heroku) if you want to skip ahead.  I'll be building that incrementally here.

## Prerequisites ##

I did this on Snow Leopard, which came with ruby.  

You will need git, and I used homebrew to set it up, but suspect an [installer package](http://code.google.com/p/git-osx-installer/downloads/list?can=3) may be easier.

Much of this is done in a command shell.  I use /Applications/Utilities/Terminal.app

## SSH key generation ##

Skip this part if you already have keys in ~/.ssh

    $ ssh-keygen -t rsa -C "your_email@yourdomain.com"
    Generating public/private rsa key pair.
    Enter file in which to save the key (/Users/bill/.ssh/id_rsa): 
    Enter passphrase (empty for no passphrase): 
    Enter same passphrase again: 
    Your identification has been saved in /Users/bill/.ssh/id_rsa.
    Your public key has been saved in /Users/bill/.ssh/id_rsa.pub.
    The key fingerprint is:
    d0:be:a9:61:34:a7:03:4d:22:cc:57:72:7a:3a:a6:ec your_email@yourdomain.com
    The key's randomart image is:
    +--[ RSA 2048]----+
    |    . o          |
    | o   = .         |
    |  + + + .        |
    |   o * o         |
    |    = + S        |
    | . o + + o       |
    |  o   = o        |
    | .   . +         |
    |  E   .          |
    +-----------------+
    ssh-add -k id_rsa

Give it a good passphrase ... it'll protect you against the id\_rsa file getting stolen, and the _ssh-add_ there means it gets stored in your keychain, so you don't have to type it all the time. 

## Heroku Setup ##

Visit [the heroku signup page](https://api.heroku.com/signup) and enter your email address.

Hit "Sign Up" and enter a password.  They will send you an email, follow the verification link contained in it.

Congratulations, now you have a heroku account!

## The Simplest Possible Sinatra App ##

    $ gem install sinatra
    
    $ cat > app.rb
    require 'sinatra'
    
    get '/hi' do
      "Hello World\n"
    end
    ^D
    

(That ^D is you holding down the control key and typing 'd', or control-D.  I'll continue the convention as we go along.)

Let's run your application:

    $ ruby -rubygems app.rb 

Congratulations, you have a web app running on your localhost.  Use the _curl_ command to see it in action:

    $ curl http://localhost:4567/hi
    Hello World

You can type ^C to stop it.

## Commit often ##

That was a pretty substantial chunk of work, building a whole web app, you wouldn't want to lose it.  Let's put it in source control:

    $ git init
    $ git add .
    $ git commit -m "First commit of our masterpiece"

## Rack it up ##

Heroku wants our application to be a rack application, so we're going to need a rack configuration file:

    $ cat > config.ru
    require './app'
    run Sinatra::Application
    ^D

Now, the command line is a little different to run it.

    $ rackup config.ru

... and the port is different, so our curl to test must be as well:

    $ curl http://localhost:9292/hi
    Hello World

Again, ^C to cancel.  And don't forget to save your work:

    $ git add config.ru
    $ git commit -a -m "Add rackup"

## Tidy little bundles ##

Heroku needs to be told which gems we use, and bundler is the way to tell them.  It's good in general for managing your gems, and it's time to start adding a little structure.

    $ cat > Gemfile

    source :rubygems
    gem 'sinatra'
    ^D

The way bundler works, you edit your _Gemfile_ to tell it what gems you need, then running _bundle install_ will cause the necessary gems (and all the gems those depend on) to be installed.  We're about to run _gem install_ for the last time ever:

    $ gem install bundler
    $ bundle install

## Going Live ##

Now we have everything we need to deploy a real live application on the internet.  Let's move the levers all the way forward:

    $ gem install heroku
      ... stuff omitted ...
    $ heroku create
    Enter your Heroku credentials.
    Email: bill@actbluetech.com
    Password: 
    Found existing public key: /Users/bill/.ssh/id_rsa.pub
    Uploading ssh public key /Users/bill/.ssh/id_rsa.pub
    Creating pure-dawn-3947.... done, stack is bamboo-mri-1.9.2
    http://pure-dawn-3947.heroku.com/ | git@heroku.com:pure-dawn-3947.git
    Git remote heroku added
    $ git push heroku master

That _heroku create_ made up a seemingly random _pure-dawn-3947_ name.  We are now live on the internet. Isn't it exciting?

    $ curl http://pure-dawn-3947.heroku.com/hi
    Hello World

(Your app name will not be _pure-dawn-3947_, so substitute as appropriate.)

We can give it a better name, as long as noone else has taken it.

    $ heroku rename actblue-brownbag
    http://actblue-brownbag.heroku.com/ | git@heroku.com:actblue-brownbag.git
    Git remote heroku updated

... and now we can see it at our fabulous site:

    $ curl http://actblue-brownbag.heroku.com/hi
    Hello World

## Web Pages ##

This is all well and good, but some people want to use a web browser (Chrome, Safari, Firefox, or God forbid Internet Explorer) to consume our content.  For this we'll need to write some HTML.

Use your favorite text editor to add this to your _app.rb_ file:

    get '/page' do
      "<html><body><h1>Hello World!</h1></body></html>"
    end

What you're saying there is: if a request asks for _/page_, respond with this html document here.

... and let's see what that looks like, live on the internet

    git commit -a -m "Add an action that returns a html document"
    git push heroku master

Point your web browser at this new [/page](http://actblue-brownbag.heroku.com) action, and see this full marked up page in all its glory.

## Slim Templates ##

Writing full html documents gets tedious pretty fast, with all those angle brackets and stuff.  And you pretty quickly have to start paying attention to whether you've closed all the tags you've opened.  Big hassle.

Enter a template language.  The most popular for ruby is probably .erb, but for our purposes here we'll use [slim](http://slim-lang.com/index.html).

This one's pretty complicated, with three different changes to make.  Try and keep up.

This goes in your Gemfile:

    gem 'slim'

This goes at the top of your _app.rb_ file:

    require 'slim'

... and all this goes at the end of that same _app.rb_ file:

    get '/template' do
      slim :inline_template
    end
    
    __END__
    
    @@inline_template
    
    h1
      | Hello World!!!

You will need to _bundle install_ before restarting, and afterward [/template](http://actblue-brownbag.heroku.com/template) will show more enthusiasm than the other page did.

## Template Files ##

We're using a relatively obscure feature of ruby, where you can put whatever you like below \_\_END\_\_ in your ruby file, and slim knows to go looking there for templates.

By the time we need more than a template or two that starts getting tedious, though, and it's useful to break out the templates into separate files.  (Watch out, soon we're going to have a whole project here.)

    $ mkdir views
    $ cat > views/file.slim
    h1
      | Hello World!!!!
    ^D

... and add this to _app.rb_:

    get '/file' do
      slim :file
    end

Not only are there now both files and directories in our project, but now we have three different actions.  Go check [/file](http://actblue-brownbag.heroku.com/file) and see how much more enthusiasm you find.  Go ahead, we'll wait.

## Layout File ##

Very often you want a unified look for your whole web site, with headers and footers and stuff.  It's not very elegant to put all that stuff in every page's template, so we use layout files.

    $ cat > views/layout.slim
    doctype html
    html
      head
        title Brown Bag
        meta charset="utf-8"
        
      body
        header
          h1
           a href="http://www.actblue.com/" ActBlue Forced Fun
           
        == yield
        
      footer
        small
          | Copyright #{Time.now.year}

This is by far the most typing we've done, and I'll excuse you if you need a break.

Back yet?  That demonstrates a couple of features of our template engine.  

* Note the bit in the #{ }?  That's ruby code that gets evaluated, and can be as complicated as you like.  It also tells you that the static bits of a slim templates get treated as ruby strings, with the usual interpolations.
* The _yield_ is the spot where your individual page templates will get included.
* The _a_ element has an _href_ attribute.  Some html elements want those, and slim makes it really easy.

## The Big Number ##

If you visit the [ActBlue Home Page](https://secure.actblue.com) you'll find the ActBlue *Big Number*, the total dollars raised over all time.  That number is dynamically updated in real time using some javascript magic, and we can add that to our page without a whole lot of work.

Some javascript links need to go in our _layout.slim_ file, just below the meta line, and in the same column (whitespace matters in slim):

    script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js'
    script type='text/javascript' src='http://js.pusherapp.com/1.10/pusher.min.js'
    script type='text/javascript' src='javascript/bignumber.js'

We'll add the [public/javascript/bignumber.js](https://raw.github.com/cluesque/simplest-sinatra-heroku/master/public/javascript/bignumber.js) file, miraculously prepared by scraping code from the public ActBlue page, and some extra stuff at the bottom of file.slim:

    p
      | $
      span#bignumber 2000000
      
    script type='text/javascript'
      | $(function() { BigNumber.init($('#bignumber')) });

We just added an element with an id using slim, and a javascript block.

## Issues ##

We use the github issue tracker to keep track of bugs in our application, features under development, that kind of thing.

They present an API for accessing the data, and maybe we'd like to present it differently. No problem! We have a web site on the internet! It can do anything!

The template file for rendering this has some complexity to it:

    cat > views/issues.slim
    table
      thead
        tr
          th Number
          th Title
      tbody
        - @issues.each do |issue|
          tr
            td
              a href=issue['html_url']
                = issue['number']
            td = issue['title']
          tr
            td &nbsp;
            td = issue['body']
    ^D

That shows a key feature of template engines for building web pages - the ability to loop.  The _@issues_ array is walked, passing a variable named _issue_ (a different one every time) to get passed in, so that there's one row in the table for every issue in the array.

Again, the code elves are going to discreetly hand us a preconstructed library [github.rb](https://raw.github.com/cluesque/simplest-sinatra-heroku/master/github.rb), but it's not that big and even you can probably read it.

It does introduce an interesting new concept - heroku configuration variables.  If you go deeper into heroku you'll find that lots of configuration (i.e., a pointer to your database) is passed to the application with environment variables.  We can keep any variables we like in there, and for this example we're storing github user, password, and project information there.  We configure it using the heroku command line:

    $ heroku config:add GITHUB_USER=my_user_name
    $ heroku config:add GITHUB_PWD=my_password
    $ heroku config:add GITHUB_PROJECT=my_user_name/my_project

When you do that there's a fair amount of noise ... it's actually restarting your app every time you make a change, so running apps always have the latest configuration.

This has a couple of uses:
* Run the same source code on multiple heroku apps with different configurations.
* Don't put secrets like passwords in your source code.

Some housekeeping to make it all go - there are some gems our github library depends on:

    $ echo >> Gemfile
    gem 'httparty'
    gem 'json'
    ^D
    $ bundle install

... and we need to to the _app.rb_:

    require './github'
    
    get '/issues' do
      @issues = GithubClient.issues
      slim :issues
    end

## Conclusions ##

Here we started with the simplest web app possible, deployed it live on the internet, and incrementally explored some central concepts of a web application framework. 

* sinatra provides a very simple framework for servicing web requests
* slim is a lightweight template engine for generating html documents
* template files can be in the application, or in the filesystem
* layout templates can get applied to all (or only some) of your pages
* heroku makes it really easy (and free) to get an application on the web
* heroku provides a path for runtime configuration
