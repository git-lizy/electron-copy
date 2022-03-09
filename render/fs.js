var fs = require('fs')
var path = require('path')

/** 
 * @description 根据文件夹路径读取文件夹里的所有子文件 
 * @returns 返回所有子文件路径
 */
function readFolder(fullPath,) {
  if (!fullPath) return []
  // 判断文件类型
  const fileStat = fs.statSync(fullPath)
  if (fileStat.isDirectory()) {
    // 文件夹
    const files = fs.readdirSync(fullPath);
    return files
  }
  else if (fileStat.isFile()) {
    // 文件
    return [fullPath]
  }
  else {
    return []
  }
}

/**
 * @description 返回新的文件数组
 * @param {*} _dir 
 * @param {*} files 
 * @returns { name: 文件名， fullPath: 文件全路径 }
 */
function redefineFiles(_dir, files) {
  const _files = []
  for (let i = 0; i < files.length; i++) {
    const fileName = files[i]
    _files.push({
      name: fileName,
      fullPath: `${_dir}\\${fileName}`
    })
  }
  return _files
}

/**
 * @description 复制文件或文件夹到新的文件夹下
 * @param {*} files 
 * @param {*} folders 
 */
async function copyFileToFolder(files) {
  try {
    for (const file of files) {
      await copyFolder(file.srcDir, file.tarDir)
    }
    return Promise.resolve('文件复制成功！')
  } catch (error) {
    return Promise.reject(error)
  }
}


/**
 * @description ! 将srcDir文件下的文件、文件夹递归的复制到tarDir文件下
 * @param {*} srcDir 
 * @param {*} tarDir
 */
var copyFolder = async (srcDir, tarDir) => {
  try {
    // 判断源文件类型
    let sourceStat = fs.statSync(srcDir)
    if (sourceStat.isDirectory()) {
      if (srcDir == tarDir) throw '源文件与目标文件不能相同'
      // 读取源文件信息
      let files = fs.readdirSync(srcDir)
      if (!files || !files.length) return console.log('源文件不存在！' + srcDir)
      for (const file of files) {
        let srcPath = path.join(srcDir, file)
        let tarPath = path.join(tarDir, file)
        // 判断文件类型
        const fileStat = fs.statSync(srcPath)
        if (fileStat.isDirectory()) {
          // 文件夹
          if (!fs.existsSync(tarPath)) {
            console.log('mkdir', tarPath)
            // 文件夹不存在 新建文件夹
            await fs.mkdirSync(tarPath)
          }
          await copyFolder(srcPath, tarPath)
        }
        else {
          // 文件
          await copyFile(srcPath, tarPath);
        }
      }
    } else {
      let fileName = path.basename(srcDir)
      let tarPath = path.join(tarDir, fileName)
      // 文件
      await copyFile(srcDir, tarPath);
    }
  } catch (error) {
    throw error
  }
}


//! 将srcPath路径的文件复制到tarPath
var copyFile = async (srcPath, tarPath) => {
  try {
    await fs.cpSync(srcPath, tarPath)
  } catch (error) {
    throw error
  }
  // var rs = fs.createReadStream(srcPath);
  // rs.on('error', function (err) {
  //   if (err) {
  //     console.log('read error', srcPath);
  //   }
  //   cb && cb(err);
  // })

  // var ws = fs.createWriteStream(tarPath);
  // ws.on('error', function (err) {
  //   if (err) {
  //     console.log('write error', tarPath);
  //   }
  //   cb && cb(err);
  // })
  // ws.on('close', function (ex) {
  //   cb && cb(ex);
  // })

  // rs.pipe(ws);
}