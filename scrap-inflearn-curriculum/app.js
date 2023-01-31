const { firefox, devices } = require('playwright');
const fs = require('fs');

// TODO: 전역 변수. 웹브라우저 정보, 디버깅 여부, 타이틀을 설정.
const _GLOBAL = {
  USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0',
  DEBUG: true,
  TITLE: '처음-만난-리액트',
};

/**
 * 브라우저 생성
 * @returns browser
 */
const getBrowser = () => {
  return firefox.launch({
    headless: !_GLOBAL.DEBUG, // 'headless' 옵션은 스크래핑을 자동으로 동작하는 가상 브라우저를 보여줄지를 설정합니다. true : 숨김, false : 숨기지 않음.
  });
};

/**
 * 페이지 생성
 * @returns page
 */
const getPage = (browser) => {
  const { USER_AGENT: userAgent } = _GLOBAL;
  return browser.newPage({ userAgent });
};

/**
 * 스크래핑
 * @returns result
 */
const scrap = async (page, url) => {
  await page.goto(url);

  const result = await page.$eval('.cd-curriculum__accordion', (target) => {
    let data = [];
    let curriculumSeq = 0;

    const sectionCover = target.querySelectorAll('.cd-accordion__section-cover');

    sectionCover.forEach((elementFirst) => {
      const sectionTitle = elementFirst.querySelector('.cd-accordion__section-title');
      const sectionCover = elementFirst.querySelectorAll('.ac-accordion__unit-title');
      sectionCover.forEach((elementSecond, idx) => {
        data.push(`${++curriculumSeq}. ${sectionTitle.innerText.trim()} > ${++idx}. ${elementSecond.innerText.trim()}`);
      });
    });

    return data;
  });

  return result;
};

/**
 * 콘솔 출력(디버깅 모드일 경우)
 * @returns
 */
const logToConsole = (data) => {
  if (_GLOBAL.DEBUG) {
    console.log(`${new Date().toLocaleString()} [DEBUG] \n`);
    console.log(data.join('\n'));
  }
};

/**
 * 결과를 지정한 경로의 파일로 저장
 * @returns
 */
const writeToFile = (data, foldername, filename) => {
  // 배열을 문자열로 전환
  const content = data.join('\n');

  // 폴더 없으면 생성
  !fs.existsSync(foldername) && fs.mkdirSync(foldername);

  // 파일 생성
  fs.writeFile(`${foldername}/${filename}`, content, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
};

const init = async () => {
  const browser = await getBrowser();
  const page = await getPage(browser);

  const url = `https://www.inflearn.com/course/${_GLOBAL.TITLE}`;
  const result = await scrap(page, url);

  logToConsole(result);

  writeToFile(result, 'dist', `${_GLOBAL.TITLE}.txt`);

  await page.close();
  await browser.close();
};

init();
