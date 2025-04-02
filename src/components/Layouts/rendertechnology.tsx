import { faPython, faJava, faCss3, faGithub, faNodeJs, faReact, faAngular, faHtml5 } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlutter, faSwift, faAws, faDocker } from '@fortawesome/free-brands-svg-icons'; // Ensure these icons are available

export const renderTechnology = (technology: string) => {
    switch (technology) {
        case 'Python':
            return (
                <span className="flex items-center text-xs">
                    <FontAwesomeIcon icon={faPython} className="text-blue-500 h-4 w-4" />
                    <span className="ml-1 text-blue-500">{technology}</span>
                </span>
            );
        case 'Java':
            return (
                <span className="flex items-center text-xs">
                    <FontAwesomeIcon icon={faJava} className="text-red-500 h-4 w-4" />
                    <span className="ml-1 text-red-500">{technology}</span>
                </span>
            );
        case 'CSS':
            return (
                <span className="flex items-center text-xs">
                    <FontAwesomeIcon icon={faCss3} className="text-blue-500 h-4 w-4" />
                    <span className="ml-1 text-blue-500">{technology}</span>
                </span>
            );
        case 'Github':
            return (
                <span className="flex items-center text-xs">
                    <FontAwesomeIcon icon={faGithub} className="text-gray-500 h-4 w-4" />
                    <span className="ml-1 text-gray-500">{technology}</span>
                </span>
            );
        case 'Node.js':
            return (
                <span className="flex items-center text-xs">
                    <FontAwesomeIcon icon={faNodeJs} className="text-green-500 h-4 w-4" />
                    <span className="ml-1 text-green-500">{technology}</span>
                </span>
            );
        case 'React':
            return (
                <span className="flex items-center text-xs">
                    <FontAwesomeIcon icon={faReact} className="text-blue-500 h-4 w-4" />
                    <span className="ml-1 text-blue-500">{technology}</span>
                </span>
            );
        case 'Angular':
            return (
                <span className="flex items-center text-xs">
                    <FontAwesomeIcon icon={faAngular} className="text-red-500 h-4 w-4" />
                    <span className="ml-1 text-red-500">{technology}</span>
                </span>
            );
        case 'HTML':
            return (
                <span className="flex items-center text-xs">
                    <FontAwesomeIcon icon={faHtml5} className="text-orange-500 h-4 w-4" />
                    <span className="ml-1 text-orange-500">{technology}</span>
                </span>
            );
        case 'Flutter':
            return (
                <span className="flex items-center text-xs">
                    <FontAwesomeIcon icon={faFlutter} className="text-blue-500 h-4 w-4" />
                    <span className="ml-1 text-blue-500">{technology}</span>
                </span>
            );
       
        case 'AWS':
            return (
                <span className="flex items-center text-xs">
                    <FontAwesomeIcon icon={faAws} className="text-orange-500 h-4 w-4" />
                    <span className="ml-1 text-orange-500">{technology}</span>
                </span>
            );
        case 'Docker':
            return (
                <span className="flex items-center text-xs">
                    <FontAwesomeIcon icon={faDocker} className="text-blue-500 h-4 w-4" />
                    <span className="ml-1 text-blue-500">{technology}</span>
                </span>
            );
        default:
            return (
                <span className="flex items-center text-xs">
                    <span className="ml-1 text-gray-500">Unknown</span>
                </span>
            );
    }
};


