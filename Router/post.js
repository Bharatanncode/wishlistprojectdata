const express = require("express");
const router = express.Router();
const Shopify = require("shopify-api-node");
require('dotenv').config();
const Seller = require("../Model/model");
const { logger } = require('../loggers/Loggers');

router.post("/wishlistProject", async (req, res) => {
  try {
    const { shop ,metafield_obj } = req.body;
    if (!shop) {
      return res.status(400).send({ status: "error", message: "Please enter a shop" });
    }
    // Find the seller in the database based on the shop value
    const seller = await Seller.findOne({ MyShopifyDomain: shop }, { _id: 0, MyShopifyDomain: 1, accessToken: 1 });
    if (!seller) {
      return res.status(400).send({ status: "error", message: "Seller not found for the given shop" });
    }
      // Create a new instance of the Shopify API client
      const shopifyClient = new Shopify({
        shopName: seller.MyShopifyDomain,
        accessToken: seller.accessToken,
        apiVersion: process.env.API_version,
      });
      
      let finalMetafield = [];
      finalMetafield.push(metafield_obj);
      let value =  JSON.stringify(finalMetafield);
      let createdMetafield = await shopifyClient.metafield.create({
        namespace: 'ACPTiered',
        key: 'wishlist',
        value: `${value}`,
        type: "json",
    });
      return res.status(200).send({ status: 'success', message: 'Metafield created successfully',createdMetafield});   
  } catch (error) {
    logger.info(`(Shop:) ${shop},(Router:) /wishlistProject ,(File:) post.js, (Error:)` + ' ' + error.message + ' ' + new Date());
    return res.status(500).send({ status: 'error', message: 'Something went wrong, please try again later.', errorMessage: error.message });
  }
});
router.delete('/metafieldDelete', async(req,res)=>{
  try {
    const { shop ,createmetafieldId} = req.body;
      if (!shop) {
        return res.status(400).send({ status: "error", message: "Please enter a shop" });
      }
      // Find the seller in the database based on the shop value
      const seller = await Seller.findOne({ MyShopifyDomain: shop }, { _id: 0, MyShopifyDomain: 1, accessToken: 1 });
      if (!seller) {
        return res.status(400).send({ status: "error", message: "Seller not found for the given shop" });
      }
        // Create a new instance of the Shopify API client
        const shopifyClient = new Shopify({
          shopName: seller.MyShopifyDomain,
          accessToken: seller.accessToken,
          apiVersion: process.env.API_version,
        });
       let metafield = await shopifyClient.metafield.delete(createmetafieldId)  
       if (metafield) {   
         return res.status(200).send({ status: 'success', message: 'Metafield successfully Deleted'});
       }
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).send({ status: 'error', message: 'Something went wrong, please try again later.', errorMessage: error.message });
    
  }
})
//Demo...Done
router.post("/addMetafieldValue11", async (req, res) => {
  try {
    const { shop, metafield_obj } = req.body;
    if (!shop || !metafield_obj) {
      return res.status(400).send({ status: "error", message: "Please provide shop and metafield_obj" });
    }

    // Find the seller in the database based on the shop value
    const seller = await Seller.findOne({ MyShopifyDomain: shop }, { _id: 0, MyShopifyDomain: 1, accessToken: 1 });
    if (!seller) {
      return res.status(400).send({ status: "error", message: "Seller not found for the given shop" });
    }

    // Create a new instance of the Shopify API client
    const shopifyClient = new Shopify({
      shopName: seller.MyShopifyDomain,
      accessToken: seller.accessToken,
      apiVersion: process.env.API_version,
    });
    // Fetch the existing metafield



    const existingMetafield = await shopifyClient.metafield.get(21627411136579);

    if (!existingMetafield) {
      return res.status(404).send({ status: "error", message: "Metafield not found" });
    }

    // Parse the existing value as JSON
    const existingValue = JSON.parse(existingMetafield.value);

    // Check if a metafield with the same product ID already exists
    const productExists = existingValue.some((item) => item.productId === metafield_obj.productId);

    if (productExists) {
      return res.status(409).send({ status: "error", message: "Metafield for the same product ID already exists" });
    }

    // Push the new value into the existing value array
    existingValue.push(metafield_obj);

    // Update the metafield with the modified value
    const updatedMetafield = await shopifyClient.metafield.update(existingMetafield.id, {
      value: JSON.stringify(existingValue),
    });

    return res.status(200).send({ status: 'success', message: 'Value added to metafield successfully', updatedMetafield });
  } catch (error) {
    logger.info(`(Shop:) ${shop},(Router:) /addMetafieldValue ,(File:) post.js, (Error:)` + ' ' + error.message + ' ' + new Date());
    return res.status(500).send({ status: 'error', message: 'Something went wrong, please try again later.', errorMessage: error.message });
  }
});
router.delete("/deleteMetafieldValue1", async (req, res) => {
  try {
    const { shop, productIdToDelete } = req.body;
    if (!shop || !productIdToDelete) {
      return res.status(400).send({ status: "error", message: "Please provide shop and productIdToDelete" });
    }

    // Find the seller in the database based on the shop value
    const seller = await Seller.findOne({ MyShopifyDomain: shop }, { _id: 0, MyShopifyDomain: 1, accessToken: 1 });
    if (!seller) {
      return res.status(400).send({ status: "error", message: "Seller not found for the given shop" });
    }

    // Create a new instance of the Shopify API client
    const shopifyClient = new Shopify({
      shopName: seller.MyShopifyDomain,
      accessToken: seller.accessToken,
      apiVersion: process.env.API_version,
    });

    // Fetch the existing metafield
    const existingMetafield = await shopifyClient.metafield.get(21627411136579);

    if (!existingMetafield) {
      return res.status(404).send({ status: "error", message: "Metafield not found" });
    }

    // Parse the existing value as JSON
    const existingValue = JSON.parse(existingMetafield.value);

    // Filter out objects with matching productIdToDelete
    const filteredValue = existingValue.filter((item) => item.productId !== productIdToDelete);

    // Update the metafield with the filtered value
    const updatedMetafield = await shopifyClient.metafield.update(existingMetafield.id, {
      value: JSON.stringify(filteredValue),
    });

    return res.status(200).send({ status: 'success', message: 'Value deleted from metafield successfully'});
  } catch (error) {
    logger.info(`(Shop:) ${shop},(Router:) /deleteMetafieldValue ,(File:) post.js, (Error:)` + ' ' + error.message + ' ' + new Date());
    return res.status(500).send({ status: 'error', message: 'Something went wrong, please try again later.', errorMessage: error.message });
  }
});



//......................ye API Done.......
router.post("/addMetafieldValue", async (req, res) => {
  try {
    const { shop, metafield_obj ,createmetafieldId} = req.body;
    if (!shop || !metafield_obj) {
      return res.status(400).send({ status: "error", message: "Please provide shop and metafield_obj" });
    }
    const seller = await Seller.findOne({ MyShopifyDomain: shop }, { _id: 0, MyShopifyDomain: 1, accessToken: 1 });
    if (!seller) {
      return res.status(400).send({ status: "error", message: "Seller not found for the given shop" });
    }
    const shopifyClient = new Shopify({
      shopName: seller.MyShopifyDomain,
      accessToken: seller.accessToken,
      apiVersion: process.env.API_version,
    });
    // Fetch the existing metafield
    if (createmetafieldId =='') {
      let finalMetafield = [];
    finalMetafield.push(metafield_obj);
    let value =  JSON.stringify(finalMetafield);
    let createdMetafield = await shopifyClient.metafield.create({
      namespace: 'ACPTiered',
      key: 'wishlist',
      value: `${value}`,
      type: "json",
  });
    let metafieldId = createdMetafield.id
    return res.status(200).send({ status: 'success', metafieldId : metafieldId})
    } else {
    const existingMetafield = await shopifyClient.metafield.get(createmetafieldId);

    if (!existingMetafield) {
      return res.status(404).send({ status: "error", message: "Metafield not found" });
    }

    // Parse the existing value as JSON
    const existingValue = JSON.parse(existingMetafield.value);

    // Check if a metafield with the same product ID already exists
    const productExists = existingValue.some((item) => item.productId === metafield_obj.productId);

    if (productExists) {
      return res.status(409).send({ status: "error", message: "Metafield for the same product ID already exists" });
    }

    // Push the new value into the existing value array
    existingValue.push(metafield_obj);

    // Update the metafield with the modified value
    const updatedMetafield = await shopifyClient.metafield.update(existingMetafield.id, {
      value: JSON.stringify(existingValue),
    });

    return res.status(200).send({ status: 'success', message: 'Value added to metafield successfully', updatedMetafield });
  }
  } catch (error) {
    logger.info(`(Shop:) ${shop},(Router:) /addMetafieldValue ,(File:) post.js, (Error:)` + ' ' + error.message + ' ' + new Date());
    return res.status(500).send({ status: 'error', message: 'Something went wrong, please try again later.', errorMessage: error.message });
  }
});

router.delete("/DeleteMetafieldValue", async (req, res) => {
try {
const { shop, ProductIdToDelete ,createmetafieldId} = req.body;
if ( !shop || !ProductIdToDelete || !createmetafieldId) {
return res.status(400).send({ status: "error", message: "Please provide shop ,productIdToDelete And createmetafieldId" });
}
const seller = await Seller.findOne({ MyShopifyDomain: shop }, { _id: 0, MyShopifyDomain: 1, accessToken: 1 });
if (!seller) {
return res.status(400).send({ status: "error", message: "Seller not found for the given shop" });
}
const shopifyClient = new Shopify({
shopName: seller.MyShopifyDomain,
accessToken: seller.accessToken,
apiVersion: process.env.API_version,
});

// Fetch the existing metafield
const existingMetafield = await shopifyClient.metafield.get(createmetafieldId);
if (!existingMetafield) {
return res.status(404).send({ status: "error", message: "Metafield not found" });
}
// Parse the existing value as JSON
const existingValue = JSON.parse(existingMetafield.value);
// Filter out objects with matching productIdToDelete
const filteredValue = existingValue.filter((item) => item.productId !== ProductIdToDelete);
// Update the metafield with the filtered value
const updatedMetafield = await shopifyClient.metafield.update(existingMetafield.id, {
value: JSON.stringify(filteredValue),
});

return res.status(200).send({ status: 'success', message: 'Value deleted from metafield successfully'});
} catch (error) {
logger.info(`(Shop:) ${shop},(Router:) /deleteMetafieldValue ,(File:) post.js, (Error:)` + ' ' + error.message + ' ' + new Date());
return res.status(500).send({ status: 'error', message: 'Something went wrong, please try again later.', errorMessage: error.message });
}
});
//......................ye API Done.......

module.exports = router;
