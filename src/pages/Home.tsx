import Header from '../components/layouts/Header';
import InvoiceExtraction from '../components/layouts/InvoiceExtraction';

const Home: React.FC = () => {
    return (
        <div>
            <Header></Header>
            <InvoiceExtraction></InvoiceExtraction>
        </div>
    );
}

export default Home;