import Image from "next/image";
import home from "public/assets/header-icons/home.png";
import flash from "public/assets/header-icons/flash.png";
import people from "public/assets/header-icons/people.png";
import brain from "public/assets/header-icons/brain-cognitive.png";
import rocket from "public/assets/header-icons/rocket.png";
import dictionary from "public/assets/header-icons/dictionary.png";
import bag from "public/assets/header-icons/bag-suitcase.png";
import graph from "public/assets/header-icons/graph-dot.png";
import chat from "public/assets/header-icons/chat.png";

export function HomeIcon(props) {
    return (
        <Image src={home} alt="Home" {...props} />
    )
}

export function FlashIcon(props) {
    return (
        <Image src={flash} alt="Flash" {...props} />
    )
}

export function PeopleIcon(props) {
    return (
        <Image src={people} alt="People" {...props} />
    )
}

export function BrainIcon(props) {
    return (
        <Image src={brain} alt="Brain" {...props} />
    )
}

export function RocketIcon(props) {
    return (
        <Image src={rocket} alt="Rocket" {...props} />
    )
}

export function DictionaryIcon(props) {
    return (
        <Image src={dictionary} alt="Dictionary" {...props} />
    )
}

export function BagIcon(props) {
    return (
        <Image src={bag} alt="Bag" {...props} />
    )
}   

export function GraphIcon(props) {
    return (
        <Image src={graph} alt="Graph" {...props} />
    )
}

export function ChatIcon(props) {
    return (
        <Image src={chat} alt="Chat" {...props} />
    )
}