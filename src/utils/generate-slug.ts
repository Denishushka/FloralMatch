const translit = (str: string): string => {
    const ru = 'А-а-Б-б-В-в-Г-г-Д-д-Е-е-Ё-ё-Ж-ж-З-з-И-и-Ї-ї-Й-й-К-к-Л-л-М-м-Н-н-О-о-П-п-Р-р-С-с-Т-т-У-у-Ф-ф-Х-х-Ц-ц-Ч-ч-Ш-ш-Щ-щ-Ь-ь-Ы-ы-Ъ-ъ-Э-э-Ю-ю-Я-я'.split('-');
    const en = 'A-a-B-b-V-v-G-g-D-d-E-e-E-e-ZH-zh-Z-z-I-i-I-i-J-j-K-k-L-l-M-m-N-n-O-o-P-p-R-r-S-s-T-t-U-u-F-f-H-h-TS-ts-CH-ch-SH-sh-SCH-sch-"-"-Y-y-"-"-E-e-YU-yu-YA-ya'.split('-');
  
    let res = '';
    for (let i = 0, l = str.length; i < l; i++) {
      const s = str.charAt(i),
          n = ru.indexOf(s);
      if (n >= 0) {
        res += en[n];
      } else {
        res += s;
      }
    }
    return res;
  }
  
  export const generateSlug = (str: string): string => {
    let url: string = str.replace(/[\s]+/gi, '-');
    url = translit(url); // Функция translit, определенная ранее
  
    // eslint-disable-next-line
    url = url
      .replace(/[^0-9a-z\-]+/gi, '')  // Удаление всех символов, кроме цифр, латинских букв и дефиса
      .replace('---', '-')           // Замена двойных дефисов на одинарный
      .replace('--', '-')        // Удаление дефисов в начале и конце строки
      .toLowerCase();                 // Преобразование в нижний регистр
  
    return url;
  };
  