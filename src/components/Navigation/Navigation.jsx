import {
  Navbar,
  Nav,
  NavDropdown,
  Button,
  ButtonGroup,
  Image,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Navigation.css";

const Navigation = () => {
  return (
    <>
      <Navbar className="p-1" bg="success" expand="lg">
        <Navbar.Brand href="/home">
          <Image
            style={{ height: "4rem", width: "4rem", marginLeft: ".5rem" }}
            src="images/brand/brand_play.png"
            alt="Game Hub Round Brand"
          />
        </Navbar.Brand>

        <Navbar.Collapse id="toggleBar">
          <Nav className="mr-auto px-1">
            <Nav.Link href="/games">Browse Games</Nav.Link>
            <Nav.Link href="/leaderboards">Leader Boards</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <div className="m-1">
          <Link className="me-2" to="/log/sign_in">
            <Button variant="outline-dark" size="md">
              SIGN IN
            </Button>
          </Link>
          <Link to="/log/register">
            <Button variant="outline-dark" size="md">
              REGISTER
            </Button>
          </Link>
        </div>
        <Navbar.Toggle className="me-1 border-dark" aria-controls="toggleBar" />
      </Navbar>
    </>
  );
};

export default Navigation;


// change the sign in and register buttons using this example
// https://artwilton.medium.com/adding-a-link-to-a-bootstrap-button-with-react-router-57d2f6197588