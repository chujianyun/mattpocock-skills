import { remote } from 'webdriverio';
import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const target=process.argv[2];
const ios=target==='ios';
const bundleId=`local.e2eskill.acceptance.${target}`;
let client;
try {
 client=await remote({hostname:'127.0.0.1',port:ios?4783:4784,logLevel:'warn',connectionRetryCount:0,connectionRetryTimeout:180000,capabilities:ios?{
  platformName:'iOS','appium:automationName':'XCUITest','appium:udid':readFileSync('simulator-id','utf8').trim(),'appium:bundleId':bundleId,'appium:noReset':true,'appium:wdaLaunchTimeout':120000
 }:{platformName:'mac','appium:automationName':'mac2','appium:bundleId':bundleId,'appium:appPath':`${process.cwd()}/macos/AcceptanceNotes.app`,'appium:noReset':true}});
 const input=await client.$('~noteTitle'); await input.waitForDisplayed({timeout:15000}); await input.setValue('Native acceptance note');
 await (await client.$('~saveNote')).click();
 const saved=await client.$('~savedNote'); await saved.waitForDisplayed({timeout:10000});
 assert.equal(await saved.getText(),'Native acceptance note');
 await client.saveScreenshot(`evidence/${target}-saved.png`);
 if(ios){await client.terminateApp(bundleId);await client.activateApp(bundleId);}else{await client.execute('macos: terminateApp',{path:`${process.cwd()}/macos/AcceptanceNotes.app`});await client.execute('macos: launchApp',{path:`${process.cwd()}/macos/AcceptanceNotes.app`});}
 const persisted=await client.$('~savedNote');await persisted.waitForDisplayed({timeout:10000});
 assert.equal(await persisted.getText(),'Native acceptance note');
 await client.saveScreenshot(`evidence/${target}-relaunch.png`);
 console.log('PASS: save and relaunch persistence');
} catch(error) {
 console.error(error.stack);process.exitCode=1;
 if(client) {try{writeFileSync(`evidence/${target}-source.xml`,await client.getPageSource());await client.saveScreenshot(`evidence/${target}-failure.png`);}catch{}}
} finally {if(client){try{await client.deleteSession();}catch{}}}
