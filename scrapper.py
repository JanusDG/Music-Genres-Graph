import requests
from bs4 import BeautifulSoup
import os
import re
import time
import json
import random



def scrape_and_download_mp3(start_id=7500, end_id=10000, delay=5, scrap_related_genres=True, scrap_audio_previews=True):
    base_url = "https://volt.fm/genre/"
    audio_base_url = "https://p.scdn.co/mp3-preview/"
    output_dir = "mp3_downloads"
    os.makedirs(output_dir, exist_ok=True)
    json_file = "related_genres.json"

    for genre_id in range(start_id, end_id + 1):
        print(f"Scrapping  genre {genre_id}")
        page_url = f"{base_url}{genre_id}/"
        try:
            response = requests.get(page_url)
            if response.status_code != 200:
                print(f"Page {page_url} not found, skipping...")
                continue
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Get the title from the <h1> tag
            title_tag = soup.find('h1')
            if title_tag:
                title_text = title_tag.get_text(strip=True)
                # Sanitize title text to use as filename
                title_text = re.sub(r'[<>:"/\\|?*]', '', title_text)  # Remove any invalid filename characters
            else:
                print(f"No <h1> tag found on page {page_url}, skipping...")
                continue

            # Initialize related genres for this page
            related_genres = []

            # Scrape related genres if enabled
            if scrap_related_genres:
                # Navigate to the nested div structure to find "Related Genres"
                related_genres_section = soup.find('h2', string="Related Genres")
                if related_genres_section:
                    # Move up to the correct <div> and then find the <a> tags
                    genre_div = related_genres_section.find_parent('div').find_parent('div').find_parent('div')
                    if genre_div:
                        for link in genre_div.find_all('a', href=True):
                            genre_name = link.get_text(strip=True)
                            related_genres.append(genre_name)
                    
                    # Update the JSON file dynamically
                    if os.path.exists(json_file):
                        with open(json_file, 'r') as f:
                            related_genres_data = json.load(f)
                    else:
                        related_genres_data = {}
                    
                    if title_text not in related_genres_data:
                        related_genres_data[title_text] = related_genres
                        print(f"Added related genres for '{title_text}': {related_genres[:20]}")
                    
                    # Save updated related genres data to JSON
                    with open(json_file, 'w') as f:
                        json.dump(related_genres_data, f, indent=4)
            time.sleep(random.uniform(5, 15))

            # Download MP3 or create .txt if enabled and file does not already exist
            mp3_filename = os.path.join(output_dir, f"{title_text}.mp3")
            txt_filename = os.path.join(output_dir, f"{title_text}.txt")
            if scrap_audio_previews:
                if os.path.exists(mp3_filename) or os.path.exists(txt_filename):
                    print(f"File for '{title_text}' already exists. Skipping download.")
                else:
                    audio_url_match = re.search(r'https://p\.scdn\.co/mp3-preview/(\w+)', response.text)
                    if audio_url_match:
                        audio_id = audio_url_match.group(1)
                        audio_url = f"{audio_base_url}{audio_id}"
                        
                        # Download the MP3
                        mp3_response = requests.get(audio_url)
                        if mp3_response.status_code == 200:
                            with open(mp3_filename, 'wb') as file:
                                file.write(mp3_response.content)
                            print(f"Downloaded MP3 for genre ID {genre_id} with title '{title_text}'")
                        else:
                            print(f"Failed to download MP3 from {audio_url}")
                    else:
                        # If no MP3 link is found, create an empty .txt file
                        with open(txt_filename, 'w') as file:
                            file.write("")  # Write an empty file
                        print(f"No MP3 found on page {page_url}. Created empty file '{txt_filename}'")
                    time.sleep(random.uniform(5, 15))
        
        except Exception as e:
            print(f"An error occurred with genre ID {genre_id}: {e}")
        
        # Respectful delay between requests
        

# Run the scraper with specified parameters
scrape_and_download_mp3(scrap_related_genres=True, scrap_audio_previews=True)
