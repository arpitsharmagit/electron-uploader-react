
const selectors = {
    // Put here any selectors used in Application 
    userIdTexbox: 'input[type="text"]',
    userPasswordTexbox: 'input[name="password"]',
    signInButton: 'button[type="submit"]',
    openappSelector: '#openapp',
    openWebPageSelector: "#openweb",
    docSummarySelector: '#docsummary',
    percentageSelector: '#percentage',
    projectSelector: '#dropdown-project',
    projectItemSelector: '//*[@id="root"]/div/div[1]/div[1]/div/ul/li[2]/a',
    dropTabSelector: '#main-tab-tab-1 > strong',
    dropBasketSelector: '#dropBasket',
    progressTabSelector: '#main-tab-tab-2 > strong',
    failUploadSelector: '//*[@id="main-tab-pane-2"]/div/div/div[2]/div[2]/div/div[1]/p/span[2]',
    successUploadSelector: '//*[@id="main-tab-pane-2"]/div/div/div[2]/div[1]/div/div[1]/p/span[2]',
    cancelUploadSelector: '//*[@id="main-tab-pane-2"]/div/div/div[2]/div[3]/button',
    failedUploadsSelector:'#uploads-tab > li:nth-child(2) > a > span',
    successfulUploadsSelector:'#uploads-tab > li:nth-child(3) > a > span',
    cancelUploadsSelector:'#uploads-tab > li:nth-child(4) > a > span',
    allUploadsSelector: '#uploads-tab > li:nth-child(1) > a'
};
module.exports = selectors;
