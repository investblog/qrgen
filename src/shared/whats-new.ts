/**
 * Bundled release notes — shown on the welcome page and in Settings.
 * Ships with the build (no network). Newest first, a handful of entries max; locales fall back to `en`.
 */

export interface ReleaseNote {
  version: string;
  items: Record<string, string[]>; // UI language → lines; `en` is required
}

export const WHATS_NEW: ReleaseNote[] = [
  {
    version: '1.1.0',
    items: {
      en: [
        'New name: SVG QR Code Generator. Docs and the web generator now live on clx.cx',
        'The extension makes no network requests — every code is drawn in your browser',
        'Share links are self-contained: the image is rebuilt from the link itself on qr.clx.cx',
        'The “Auto-generate on open” setting now works',
        'Interface in 7 languages',
      ],
      ru: [
        'Новое имя: SVG QR Code Generator. Документация и веб-генератор теперь на clx.cx',
        'Расширение не делает сетевых запросов — каждый код рисуется в браузере',
        'Ссылки самодостаточны: картинка собирается из самой ссылки на qr.clx.cx',
        'Настройка «Авто-генерация при открытии» теперь работает',
        'Интерфейс на 7 языках',
      ],
      de: [
        'Neuer Name: SVG QR Code Generator. Doku und Web-Generator sind jetzt auf clx.cx',
        'Die Erweiterung stellt keine Netzwerkanfragen — jeder Code entsteht in Ihrem Browser',
        'Teilen-Links sind eigenständig: Das Bild wird auf qr.clx.cx aus dem Link selbst erzeugt',
        'Die Einstellung „Beim Öffnen generieren“ funktioniert jetzt',
        'Oberfläche in 7 Sprachen',
      ],
      es: [
        'Nuevo nombre: SVG QR Code Generator. La documentación y el generador web están ahora en clx.cx',
        'La extensión no hace solicitudes de red: cada código se dibuja en tu navegador',
        'Los enlaces son autónomos: la imagen se reconstruye a partir del propio enlace en qr.clx.cx',
        'La opción «Generar al abrir» ya funciona',
        'Interfaz en 7 idiomas',
      ],
      fr: [
        'Nouveau nom : SVG QR Code Generator. La documentation et le générateur web sont désormais sur clx.cx',
        'L’extension ne fait aucune requête réseau : chaque code est dessiné dans votre navigateur',
        'Les liens sont autonomes : l’image est reconstruite à partir du lien lui-même sur qr.clx.cx',
        'Le réglage « Générer à l’ouverture » fonctionne désormais',
        'Interface en 7 langues',
      ],
      pt: [
        'Novo nome: SVG QR Code Generator. A documentação e o gerador web agora estão em clx.cx',
        'A extensão não faz requisições de rede — cada código é desenhado no seu navegador',
        'Os links são autossuficientes: a imagem é reconstruída a partir do próprio link em qr.clx.cx',
        'A opção “Gerar ao abrir” agora funciona',
        'Interface em 7 idiomas',
      ],
      tr: [
        'Yeni ad: SVG QR Code Generator. Belgeler ve web oluşturucu artık clx.cx’te',
        'Eklenti hiçbir ağ isteği yapmaz — her kod tarayıcınızda çizilir',
        'Paylaşım bağlantıları kendi kendine yeter: görsel qr.clx.cx’te bağlantının kendisinden oluşturulur',
        '“Açılışta oluştur” ayarı artık çalışıyor',
        '7 dilde arayüz',
      ],
    },
  },
];

/** Release-note lines for a UI language (`pt-BR` → `pt`), falling back to English. */
export function releaseNoteItems(note: ReleaseNote, uiLanguage: string): string[] {
  return note.items[uiLanguage.split(/[-_]/)[0].toLowerCase()] ?? note.items.en;
}
