// export const oils = [
//     { title: "Coconut", price: 1280 },   // Rs per Kg
//     { title: "Almond", price: 6600 },
//     { title: "Amla", price: 1280 },
//     { title: "Shikakai", price: 1280 },
// ];



// export const Bottle = {
//     size : 100,
//     price: 110,
//     stickerCost: 10,
//     box: 20,
//     labourCharges: 10,
//     extraCharges: 10
// };

// export const Products = [
//     {
//         title: "Hair Oil",
//         ingredients: [
//             { oil: oils[0], percent: 15 },
//             { oil: oils[1], percent: 8 },
//             { oil: oils[2], percent: 3 },
//             { oil: oils[3], percent: 2 },
//         ],
//     },
// ];

// export const CalculateDetails = (amountKg) => {
//     let totalPrice = 0;
//     const breakdown = Products[0].items.map((item) => {
//         const portion = (amountKg * item.percent) / 100; // in Kg
//         const eachPrice = item.oil.price * portion;      // Rs
//         totalPrice += eachPrice;
//         return {
//             name: item.oil.title,
//             portion,
//             eachPrice
//         };
//     });

//     return { breakdown, totalPrice };
// };

// export const ShowAmount = (amountKg) => {
//     const { breakdown, totalPrice } = CalculateDetails(amountKg);

//     console.log(`For ${amountKg} Kg of ${Products[0].title}:\n`);
//     console.log(`No | Name        | Weight   | Price`);
//     console.log(`---------------------------------------`);

//     breakdown.forEach((item, index) => {
//         console.log(
//             `${index + 1}. | ${item.name.padEnd(10)} | ${item.portion.toFixed(3)} Kg | Rs ${item.eachPrice.toFixed(2)}`
//         );
//     });

//     console.log(`\nTotal Amount : Rs ${totalPrice.toFixed(2)}`);
// };

// export const CalculateBottles = (amountOfOilKg, bottleKg) => {
//     const { totalPrice } = CalculateDetails(amountOfOilKg);

//     const numOfBottles = Math.floor(amountOfOilKg / bottleKg);
//     const costPerKg = totalPrice / amountOfOilKg;

//     const oilCostPerBottle = costPerKg * bottleKg;

//     const packagingCost =
//         Bottle.bottlePrice +
//         Bottle.sticker +
//         Bottle.box +
//         Bottle.labourCharges +
//         Bottle.extraCharges;

//     const finalBottleCost = oilCostPerBottle + packagingCost;

//     // Print in console
//     console.log(`\nBottle Calculation (for ${bottleKg * 1000} ml bottles):`);
//     console.log(`---------------------------------------`);
//     console.log(`Number of Bottles   : ${numOfBottles}`);
//     console.log(`Oil Cost per Bottle : Rs ${oilCostPerBottle.toFixed(2)}`);
//     console.log(`Packaging Cost      : Rs ${packagingCost.toFixed(2)}`);
//     console.log(`Final Cost / Bottle : Rs ${finalBottleCost.toFixed(2)}\n`);

//     return { numOfBottles, oilCostPerBottle, packagingCost, finalBottleCost };
// };

// // // Example
// // ShowAmount(10);
// // CalculateBottles(10, 0.1);
