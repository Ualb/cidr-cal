function calcBinaries(list) {
    let arr = [];
    list.forEach(element => {
        binaryString = Number(element).toString(2);
        if (binaryString.length != 8) {
            missing = 8 - binaryString.length;
            missingString = '';
            for (let i = 0; i < missing; i++) {
                missingString += '0';               
            }
            binaryString = missingString + binaryString;
        }
        arr.push(binaryString);
    }); 
    return arr;
}

// string n's h's creator
function nCreator(en) {
    let result = '';
    for (let i = 0; i < 35; i++) {
        if (i === 8 || i === 16 || i === 24) {
            result += '.'
        }

        if (i < en) {
            result += 'n'
            continue
        }       
        result += 'h'
    } 
    return result
}

function clearHost(octens, limit, byte, isMaxMin) {
    isConcluid = false
    for (let j = 0; j < octens.length; j++) {
        if (!isConcluid) {
            subData = octens[j].substring(0, 8 - limit) 
            for (let i = 0; i < limit; i++) {
                subData += byte
            }
            octens[j] = subData
            isConcluid = !isConcluid
            continue
        }
        if (byte === '0') {
            if (isMaxMin && (j + 1) === octens.length) { 
                octens[j] = '00000001'
                continue 
            }
            octens[j] = '00000000'
            continue
        } 
        if (isMaxMin && (j + 1) === octens.length) {
            octens[j] = '11111110'
            continue
        }
        octens[j] = '11111111'
    }  
    return octens
}

function clearIp(list, en, byte, isMaxMin) { 
    if (en > 0 && en <= 8) {
        return clearHost(list, 8 - en, byte, isMaxMin)
    } else if (en > 8 && en <= 16) { 
        return list.slice(0, 1).concat(clearHost(list.slice(1), 16 - en , byte, isMaxMin)) 
    } else if (en > 16 && en <= 24) { 
        return list.slice(0, 2).concat(clearHost(list.slice(2), 24 - en, byte, isMaxMin))
    } else {
        return (list.slice(0, 3)).concat(clearHost(list.slice(3), 32 - en, byte, isMaxMin)) 
    } 
}

// insert row in binary table
function insertTable(isBin, id, min, max, broadcast) {
    binTable = isBin? document.getElementById('bin'): document.getElementById('dir')
    tbody = binTable.childNodes[3]
    // deleted the actual rows
    while(tbody.firstChild) {
        tbody.removeChild(tbody.firstChild)
    }
    
    tr = document.createElement('tr')
    for (let i = 0; i <  4; i++) {
        td = document.createElement('td') 
        switch (i) {
            case 0: td.append(id); break;
            case 1: td.append(min); break;
            case 2: td.append(max); break;
            case 3: td.append(broadcast); break;
        } 
        tr.append(td)
        tbody.appendChild(tr) 
    }
        
}

function arrToString(arr) {
    result = ''
    for (let i = 0; i < arr.length; i++) {
        result += arr[i] + ((i !== arr.length - 1)? '.': '')
    }
    return result
}

// started function
function generate(event) {
    event.preventDefault();

    let ip = document.getElementById('ip').value;
    let mask; 
    if (document.getElementById('mask2').value === 'Seleccionar') {
         mask = document.getElementById('mask1').value 
    } else {
        mask = document.getElementById('mask2').value 
    }             

    if (mask === 'Seleccionar') {
        alert('Ingrese más datos')
        return
    }

    host = 32 - mask;
    ipOctens = ip.split('.');
    binariesOctens = calcBinaries(ipOctens);
    sizeSubNet = Math.pow(2, host) - 2 
    n_h = nCreator(mask)

    redID = clearIp(binariesOctens, mask, '0', false)
    broadcast = clearIp(binariesOctens, mask, '1', false)
    min = clearIp(binariesOctens, mask, '0', true)
    max = clearIp(binariesOctens, mask, '1', true)

    insertTable(true, arrToString(redID), arrToString(min), arrToString(max), arrToString(broadcast))

    const toNumeric = (arr) => {
        return arr.map(val => parseInt(val, 2))
    }

    redIDDir = toNumeric(redID)
    broadcastDir = toNumeric(broadcast)
    minDir = toNumeric(min)
    maxDir = toNumeric(max)

    insertTable(false, arrToString(redIDDir), arrToString(minDir), arrToString(maxDir), arrToString(broadcastDir))

    document.getElementById('subred').innerHTML = n_h

}