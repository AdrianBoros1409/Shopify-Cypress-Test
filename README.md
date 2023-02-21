# Shopify-Cypress-testing
In this repository, we will be building a developer swag store powered by Shopify wit.h a custom Next.js front-end.  
The Shopify Partners account allows to create as many development stores for free.

## Getting started
1. Create [Shopify Partners Account](https://www.shopify.com/partners)  
2. Create new store and add some products  
3. Because a custom Next.js frontend will be used, it is needed to install [Storefront API](https://shopify.dev/api/storefront) from Shopify store  
4. Create the Next.js front-end for the Shopify store  
5. Fork the [Next.js Commerce Repo](https://github.com/vercel/commerce)  
6. Once the repo has been forked, clone it down locally to machine  
``git clone git@github.com:<YOUR GITHUB USERNAME>/commerce.git``  
7. Install NPM dependencies with yarn  
``yarn install``  
8. Create a file called ***.env.local*** inside of the ***site/*** directory. Open ***site/.env.local*** and update it to look like the following:  
``COMMERCE_PROVIDER=@vercel/commerce-shopify``  
``NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=<access_token>``  
``NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=<domain_name>.myshopify.com/``  
9. Start up the development server with command:  
``yarn dev``  
10. Open browser and you should see the store and products on address: [http://localhost:3000](http://localhost:3000) 
