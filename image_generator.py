 
import urllib.parse
import random


CARTOON_STYLES = [
    "cute cartoon",
    "3d animated",
    "friendly kids learning",
    "autism friendly illustration",
    "bright colorful cartoon"
]


BACKGROUND_THEMES = [
    "rainbow background",
    "playroom background",
    "classroom background",
    "happy learning environment",
    "pastel learning theme"
]


EMOTION_STYLES = [
    "happy smiling",
    "cute expressive",
    "friendly face",
    "joyful learning",
    "playful character"
]


def generate_learning_image(word="Apple"):

    style = random.choice(CARTOON_STYLES)

    background = random.choice(
        BACKGROUND_THEMES
    )

    emotion = random.choice(
        EMOTION_STYLES
    )

    image_prompt = (
        f"{style} {word} for autism learning, "
        f"{background}, {emotion}, kids educational"
    )

    image_url = (
        "https://placehold.co/600x400/png?text="
        + urllib.parse.quote(word)
    )

    return {
        "word": word,
        "image_prompt": image_prompt,
        "image_url": image_url
    }


if __name__ == "__main__":

    demo = generate_learning_image("Apple")

    print(demo)
import urllib.parse
import random


CARTOON_STYLES = [
    "cute cartoon",
    "3d animated",
    "friendly kids learning",
    "autism friendly illustration",
    "bright colorful cartoon"
]


BACKGROUND_THEMES = [
    "rainbow background",
    "playroom background",
    "classroom background",
    "happy learning environment",
    "pastel learning theme"
]


EMOTION_STYLES = [
    "happy smiling",
    "cute expressive",
    "friendly face",
    "joyful learning",
    "playful character"
]


LESSON_OBJECTS = {
    "Fruits": ["Apple", "Banana", "Orange"],
    "Animals": ["Lion", "Rabbit", "Panda"],
    "School": ["Book", "Teacher", "Pencil"],
    "Nature": ["Tree", "Rainbow", "Flower"]
}


def generate_learning_image(word="Apple"):

    style = random.choice(CARTOON_STYLES)

    background = random.choice(
        BACKGROUND_THEMES
    )

    emotion = random.choice(
        EMOTION_STYLES
    )

    image_prompt = (
        f"{style} {word} for autism learning, "
        f"{background}, {emotion}, kids educational"
    )

    image_url = (
        "https://placehold.co/600x400/png?text="
        + urllib.parse.quote(word)
    )

    return {
        "word": word,
        "image_prompt": image_prompt,
        "image_url": image_url
    }


def generate_topic_images(topic="Fruits"):

    words = LESSON_OBJECTS.get(
        topic,
        ["Learning"]
    )

    images = []

    for word in words:
        images.append(
            generate_learning_image(word)
        )

    return {
        "topic": topic,
        "images": images
    }


if __name__ == "__main__":

    demo = generate_learning_image("Apple")

    print(demo)