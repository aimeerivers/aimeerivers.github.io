# aimeerivers.github.io

- [Portfolio](https://www.aimeerivers.com/)
- [Blog](https://www.aimeerivers.com/blog/)
- [CV](https://www.aimeerivers.com/cv/)

## Running locally

### Setup

    rvm use ruby-3.1.2@blog --create
    bundle install

If you experience `fatal error: 'openssl/ssl.h' file not found`

    brew install openssl
    bundle config build.eventmachine --with-cppflags=-I$(brew --prefix openssl)/include

If you then experience `rubymain.cpp:220:3: warning: 'rb_rescue' is deprecated: Use of ANYARGS in this function is deprecated` add another flag

    bundle config build.eventmachine --with-cppflags=-I$(brew --prefix openssl)/include --with-openssl-dir=$(brew --prefix openssl)

If you expericence `Error running '__rvm_make -j10'`

    rvm install ruby-3.1.2 --with-openssl-dir=$(brew --prefix openssl@3)

Then try again

### Run the Jekyll server

    rvm use ruby-3.1.2@blog
    npm run start

Visit http://localhost:4000
