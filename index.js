'use strict';

const contentHn = document.getElementById('contentHn'),
    postBtn = document.getElementById('posts');
let rowData = '';
window.onload = () => {
    if (!window.location.hash) {
        loadData('hackernews');
        document.location.hash = '#hackernews';
    } else {
        loadData(window.location.hash.split('#')[1]);
    }
};
window.onhashchange = param => loadData(param.newURL.split('#')[1]);

// function subMenu(element) {
//     console.log(element);
// }


function loadData(channel) {
    switch (channel) {
        case 'hackernews':
            axios.get('/hackernews', {
                    responseType: 'json'
                })
                .then(response => {
                    postBtn.hidden = true;
                    // console.log(response.data.items);
                    toHnTable(response.data.items);
                })
                .catch(err => {
                    console.log(err);
                });
            break;
        case "hackernewsTop":
            postBtn.hidden = true;
            // console.log("hackernewsTOP");
            axios.get('https://hacker-news.firebaseio.com/v0/topstories.json', {
                    responseType: 'json'
                })
                .then(response => {
                    postBtn.hidden = true;
                    // console.log(response.data.items);
                    toHnlTable(response.data);
                })
                .catch(err => {
                    console.log(err);
                });
            postBtn.hidden = false;
            break;
        case 'hackerearth':
            axios.get('/hackerearth', {
                    responseType: 'document'
                })
                .then(response => {
                    console.log(response.data);
                })
                .catch(err => {
                    console.log(err);
                });
            break;
        default:
            console.log("default:  " + channel);
    }
}

function toHnTable(data) {
    // console.log("\n\n" + typeof (data) + data + "\n\n")
    contentHn.innerHTML = "";
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        // console.log(data[i] + "\n")
        contentHn.innerHTML += '<tr><td colspan="2"><p>' + data[i].content_html.replace(' URL', "").replace(/">.*\s<.*\s.*\s.*/g, `" target="_blank" > ${data[i].title}`) + '</a></div><div>Author: ' + data[i].author + '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspPublished on: ' + new Date(data[i].date_published).toLocaleString('en-GB', {
            timeZoneName: 'short',
            hc: 'h24',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }) + '</div></p></tdcolspan></tr>';
    }
    postBtn.hidden = false;
}

function toHnlTable(data) {
    // postBtn.hidden = true;
    // contentHn.hidden = true;
    contentHn.innerHTML = '';
    console.log(data.length + "\n" + data);
    let pos = 0;
    let start = 0 + pos;
    let end = 10 + pos;
    let data1 = data.slice(start, end);
    let getData = async () => {
        let postData = data1.map(id => {
            return `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
        }).map(url => axios.get(url, {
            responseType: 'json'
        }));
        try {
            return Promise.resolve((await Promise.all(postData)).map(res => res.data));
        } catch (err) {
            console.error(err);
            return Promise.reject(new Error(rowData));
        }
    };
    getData().then(res => {
        rowData = res.map(row => {
            return (`<tr>
        <td colspan="2">
        <p><a href ="${row.url}"trget="_blank" rel="noopener"> ${row.title}</a>
        </div>
        <div>Author:  ${row.by} &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
        Published on: ${new Date(row.time*1000).toLocaleString('en-GB',{
            timeZoneName : 'short',
            hc     : 'h24',
            day    : 'numeric',
            month  : 'long',
            year   : 'numeric',
            hour   : '2-digit',
            minute : '2-digit',
            second : '2-digit'
        })} 
        </div></p>
        </td>
        </tr>`)
        });
    }).catch(err => console.log(".catch => ERR:\t" + err))
    .finally(() => {
        console.log(rowData.length);
        postBtn.hidden = true;
        for (let element of rowData) {
            contentHn.innerHTML += element;
        }
        postBtn.hidden = false;
    });
    // for (let i = 0; i < 10; i++) {
    //     postBtn.hidden = true;
    //     contentHn.innerHTML = '';
    //     axios.get('https://hacker-news.firebaseio.com/v0/item/' + data[i] + '.json', {
    //             responseType: 'json'
    //         })
    //         .then(response => {
    //             console.log(response.data);
    //             postData.push(response.data);
    //             contentHn.hidden = true;
    //             contentHn.innerHTML += `<tr>
    //                                     <td colspan="2">
    //                                     <p><a href ="${response.data.url}"trget="_blank" rel="noopener"> ${response.data.title}</a>
    //                                     </div>
    //                                     <div>Author:  ${response.data.by} &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
    //                                     Published on: ${new Date(response.data.time).toLocaleString('en-GB',{
    //                                                                                                         timeZoneName : 'short',
    //                                                                                                         hc     : 'h24',
    //                                                                                                         day    : 'numeric',
    //                                                                                                         month  : 'long',
    //                                                                                                         year   : 'numeric',
    //                                                                                                         hour   : '2-digit',
    //                                                                                                         minute : '2-digit',
    //                                                                                                         second : '2-digit'
    //                                                                                                      })} 
    //                                         </div></p>
    //                                         </td>
    //                                         </tr>`;
    //             contentHn.hidden = false;
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         });
    // }
    //console.log(postData);
    // let urlArray = data.map(i => axios.get('https://hacker-news.firebaseio.com/v0/item/' + i + '.json',{ responseType: 'json' }));
    // console.log(urlArray);
}

document.getElementById('btnReload').onclick = () => loadData(window.location.hash.replace('#', ''));
let countClick = 1;
postBtn.onclick = (event) => {
    countClick++;
    if (countClick % 2 == 0) {
        window.location.hash = "hackernewsTop";
        event.srcElement.innerHTML = "Show LATEST";
    } else {
        window.location.hash = "hackernews";
        event.srcElement.innerHTML = "Show TOP";
    }
};