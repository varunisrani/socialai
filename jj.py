from collections import Counter
import math
import re

def preprocess_text(text):
    # Remove non-alphanumeric characters and convert to lowercase
    processed_text = re.sub(r'[^a-zA-Z0-9\s]', '', text.lower())
    return processed_text

def cosine_similarity(text1, text2):
    # Preprocess texts
    processed_text1 = preprocess_text(text1)
    processed_text2 = preprocess_text(text2)

    # Tokenize preprocessed texts
    words1 = processed_text1.split()
    words2 = processed_text2.split()

    # Create word count vectors
    vector1 = Counter(words1)
    vector2 = Counter(words2)

    # Calculate dot product
    dot_product = sum(vector1[word] * vector2[word] for word in vector1 if word in vector2)

    # Calculate magnitudes
    magnitude1 = math.sqrt(sum(vector1[word] ** 2 for word in vector1))
    magnitude2 = math.sqrt(sum(vector2[word] ** 2 for word in vector2))

    # Calculate cosine similarity
    similarity = dot_product / (magnitude1 * magnitude2) if magnitude1 * magnitude2 != 0 else 0

    return similarity


text1 = "hello everyone in this video I'm going to teach you how to install nexjs which is react framework okay let's get started first of all let's go to nextgs.org this is our next.js official website okay then go to document or Docs and in order to install next.js you need to install node.js on your computer okay make sure that you install node.js on your computer so you can click here to download long-term support version and after the downloads is done you just click on the files and Next Step next to finish the installation okay I'm going to close it so the next step after you install node.js let's check it out if you are on desktop if you want to install the projects on desktop just press shift on your keyboard if you are on window and then open Powershell over here so you can install to wherever you want on your computer in this case I'm going to install on desktop this is my path so the next step you just check the node version node Dash V so I have installed node.js on my computer completely so it show up like this and the next step you have to run this command npx create next app at latest okay NPA create next app at latest hit enter if we ask you what is your project named you can name it whatever you want I will name it my sample next JS hit enter so if we ask you do you need typescript I don't need typescript so I choose no and then you need uh es link I can type yes and it will download react react Dom next es lean yes a lens configs next your computer needs to connect to the internet in order to install nextgis on your computer so if you go to desktop you will see this folder on your desktop okay here it show up over here so you can open it with Visual Studio code okay this is your project you can go to terminal new terminal and then type npm install again to make sure if everything is installed correctly you can type npm run div to start next.js then you will see this URL over here you can press Ctrl and click on the link see or you can just type this URL on desktop it will show next.js this is the next.js project you can edit these projects by go to page index.js for example I'm going to show hello over here Dave hello next JS save it if I go to my desktop I will see Hello nextgis over here it will automatically compile your projects and refresh it on browser for you alright this is all about this video If you like this video don't forget to click like subscribe and comment down below thank you so much for watching - Generated with https://kome.ai"

text2 = "When it comes to learning and teaching about Next.js installation, which is a React framework, it's essential to follow a structured approach. First and foremost, one should head over to the official Next.js website at nextjs.org to access comprehensive documentation that serves as a valuable resource during the installation process. To initiate the installation, ensure that you have Node.js set up by executing the 'npm install node.js' command. Following this step, proceed by running 'npx create next app at latest' to create a new Next.js application. During this process, you will have the opportunity to designate a project name, such as 'my sample Next.js,' and choose from various options that suit your requirements. Once the project is set up, it's advisable to open it in Visual Studio Code, a popular integrated development environment. Within VSCode, run 'npm install' to install any necessary dependencies, and then execute 'npm run dev' to start the development server. With your project up and running, you can delve into editing the codebase to tailor it to your specific needs. Don't forget to save your changes regularly as you progress, enabling you to witness alterations reflect live in the application. This real-time feedback loop is not only educational but also immensely rewarding as it reinforces your understanding of Next.js. If you find this guidance helpful and informative, feel free to show your support by engaging with the content. Whether it's by liking the tutorial, subscribing to the channel for more insightful videos, or leaving a comment to share your thoughts or questions, your feedback is greatly appreciated and encourages the creation of more valuable content for the community. In summary, mastering the installation process of Next.js through practical steps like exploring its documentation, setting up Node.js, creating a new project, editing code in a familiar environment like VSCode, and observing changes in real-time can significantly enhance your proficiency with this React framework. Remember, continuous learning and hands-on experience are key to unlocking the full potential of Next.js and expanding your skills as a developer."

similarity = cosine_similarity(text1, text2)
percentage_similarity = similarity * 100

print(f"The percentage similarity between the two texts is: {percentage_similarity:.2f}%")

