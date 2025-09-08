export const normalizeUrl = (url = window.location.href) => {
    try {
      const parsedUrl = new URL(url);
      // Remove 'www.' if present
      let hostname = parsedUrl.hostname.replace(/^www\./, "");
      return `https://${hostname}`;
    } catch (error) {
      console.error("Invalid URL provided:", url);
      return "";
    }
  }

