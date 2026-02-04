import { library, config } from "@fortawesome/fontawesome-svg-core"
import { fas } from "@fortawesome/free-solid-svg-icons"

import "@fortawesome/fontawesome-svg-core/styles.css" // Import the CSS
config.autoAddCss = false // Tell Font Awesome not to add CSS automatically

// Add all solid icons to the library
library.add(fas)