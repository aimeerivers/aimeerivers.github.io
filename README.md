# sermoa.github.io

## Running locally

### Setup

    rvm use ruby-3.1.2@blog --create
    bundle install

If you experience `fatal error: 'openssl/ssl.h' file not found`

    brew install openssl
    bundle config build.eventmachine --with-cppflags=-I$(brew --prefix openssl)/include

Then try again

### Run the Jekyll server

    rvm use ruby-3.1.2@blog
    bundle exec jekyll serve

Visit http://localhost:4000
