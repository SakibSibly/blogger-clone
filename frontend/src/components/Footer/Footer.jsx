import { useState } from "react";

const linkClass = "hover:text-white transition-colors mb-1 block";
const spanClass = "border-l border-gray-600 h-4 self-center mx-2";

const Footer = () => {
  const [isActive, setIsActive] = useState(false);

  const handleBgColor = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    setIsActive(false);
  };

  const selectClass = isActive
    ? "bg-black p-3 rounded max-w-xs "
    : "bg-gray-700 p-3 rounded hover:bg-gray-600 max-w-xs";

  return (
    <footer className="footer bg-gray-800">
      <div className="px-20">
        <section className="flex gap-30 text-gray-300 py-20">
          <ul>
            <li className="font-bold mb-7 text-gray-100">Help</li>
            <li><a href="#" className={linkClass}>Help Center</a></li>
            <li><a href="#" className={linkClass}>Help Forum</a></li>
            <li><a href="#" className={linkClass}>Video Tutorials</a></li>
          </ul>
          <ul>
            <li className="font-bold mb-7 text-gray-100">Community</li>
            <li><a href="#" className={linkClass}>Blogger Buzz</a></li>
          </ul>
          <ul>
            <li className="font-bold mb-7 text-gray-100">Developers</li>
            <li><a href="#" className={linkClass}>Blogger API</a></li>
            <li><a href="#" className={linkClass}>Developer Forum</a></li>
          </ul>
        </section>
        <hr className="border-gray-700" />
        <section className="flex justify-between items-center py-5 text-gray-300">
          <ul className="flex gap-5">
            <li>Terms of Service</li>
            <span className={spanClass}></span>
            <li>Privacy</li>
            <span className={spanClass}></span>
            <li>Content Policy</li>
          </ul>
          
          <select name="language" id="language-select" className={`${selectClass} cursor-pointer`} defaultValue="en" onClick={handleBgColor} onBlur={handleBlur}>
            <option value="af">Afrikaans‎</option>
            <option value="am">Amharic - አማርኛ‎</option>
            <option value="ar">Arabic - العربية‎</option>
            <option value="eu">Basque - euskara‎</option>
            <option value="bn">Bengali - বাংলা‎</option>
            <option value="bg">Bulgarian - български‎</option>
            <option value="ca">Catalan - ‪Català‬‎</option>
            <option value="zh-HK">Chinese (Hong Kong) - 中文（香港)‎</option>
            <option value="zh-CN">Chinese (Simplified) - ‪简体中文‬‎</option>
            <option value="zh-TW">Chinese (Traditional) - 繁體中文‎</option>
            <option value="hr">Croatian - Hrvatski‎</option>
            <option value="cs">Czech - Čeština‎</option>
            <option value="da">Danish - Dansk‎</option>
            <option value="nl">Dutch - Nederlands‎</option>
            <option value="en">English</option>
            <option value="en-GB">English (United Kingdom)‎</option>
            <option value="et">Estonian - eesti‎</option>
            <option value="fil">Filipino‎</option>
            <option value="fi">Finnish - Suomi‎</option>
            <option value="fr-CA">French (Canada) - Français (Canada)‎</option>
            <option value="fr">French (France) - Français (France)‎</option>
            <option value="gl">Galician - galego‎</option>
            <option value="de">German - Deutsch‎</option>
            <option value="el">Greek - Ελληνικά‎</option>
            <option value="gu">Gujarati - ગુજરાતી‎</option>
            <option value="iw">Hebrew - עברית‎</option>
            <option value="hi">Hindi - हिन्दी‎</option>
            <option value="hu">Hungarian - magyar‎</option>
            <option value="is">Icelandic - íslenska‎</option>
            <option value="id">Indonesian - Indonesia‎</option>
            <option value="it">Italian - Italiano‎</option>
            <option value="ja">Japanese - 日本語‎</option>
            <option value="kn">Kannada - ಕನ್ನಡ‎</option>
            <option value="ko">Korean - 한국어‎</option>
            <option value="lv">Latvian - latviešu‎</option>
            <option value="lt">Lithuanian - lietuvių‎</option>
            <option value="ms">Malay - Bahasa Melayu‎</option>
            <option value="ml">Malayalam - മലയാളം‎</option>
            <option value="mr">Marathi - मराठी‎</option>
            <option value="no">Norwegian - norsk‎</option>
            <option value="fa">Persian - فارسی‎</option>
            <option value="pl">Polish - polski‎</option>
            <option value="pt-BR">Portuguese (Brazil) - Português (Brasil)‎</option>
            <option value="pt-PT">Portuguese (Portugal) - português (Portugal)‎</option>
            <option value="ro">Romanian - română‎</option>
            <option value="ru">Russian - Русский‎</option>
            <option value="sr">Serbian - српски‎</option>
            <option value="sk">Slovak - Slovenčina‎</option>
            <option value="sl">Slovenian - slovenščina‎</option>
            <option value="es-419">Spanish (Latin America) - Español (Latinoamérica)‎</option>
            <option value="es">Spanish (Spain) - Español (España)‎</option>
            <option value="sw">Swahili - Kiswahili‎</option>
            <option value="sv">Swedish - Svenska‎</option>
            <option value="ta">Tamil - தமிழ்‎</option>
            <option value="te">Telugu - తెలుగు‎</option>
            <option value="th">Thai - ไทย‎</option>
            <option value="tr">Turkish - Türkçe‎</option>
            <option value="uk">Ukrainian - Українська‎</option>
            <option value="ur">Urdu - اردو‎</option>
            <option value="vi">Vietnamese - Tiếng Việt‎</option>
            <option value="zu">Zulu - isiZulu‎</option>
          </select>
        </section>
      </div>
    </footer>
  );
};

export default Footer;