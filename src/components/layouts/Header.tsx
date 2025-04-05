import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useAuth } from '../../hooks/authService';
import { useNavigate } from 'react-router-dom';

function Header () {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
        }
    };

    const displayName = user ? (user.name || user.email) : 'Đăng nhập';

    return (
        <Navbar expand="lg" className="bg-body-tertiary" bg="primary" data-bs-theme="dark">
            <Container>
                <Navbar className="bg-body-tertiary">
                    <Container>
                        <Navbar.Brand href="#home">
                            <img
                            src="bill.png"
                            width="50"
                            height="50"
                            className="d-inline-block align-top"
                            alt="React Bootstrap logo"
                            />
                        </Navbar.Brand>
                        <Navbar.Brand href="#home">Trích xuất Hoá đơn</Navbar.Brand>
                    </Container>
                </Navbar>

                <Navbar className="bg-body-tertiary" style={{color: "white" }}>
                    <NavDropdown title={displayName}  id="collapsible-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Kho dữ liệu</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">
                            Nhóm
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Cài đặt</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={handleLogout}>
                            Đăng xuất
                        </NavDropdown.Item>
                    </NavDropdown>
                </Navbar>


            </Container>
        </Navbar>
      );
}
export default Header;
