import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Button, Icon, Modal, Form, Message } from "semantic-ui-react";
import { useToasts } from "react-toast-notifications";
import { Table } from "../Table/Table";
import { ItemCRUDTopHeader } from "../ItemCRUDTopHeader/ItemCRUDTopHeader";

const TERMS = gql`
    {
        terms {
            id,
            title,
        }
    }
`;

const ADD_TERMS = gql`
    mutation AddTerms($title: String!){
        addTerms(title: $title) {
            title,
        }
    }
`;

const DELETE_TERMS = gql`
    mutation deleteTerms($id: ID!){
        deleteTerms(id: $id) {
            id,
        }
    }
`;

export const Terms = () => {
    const { loading, error, data } = useQuery(TERMS);
    const [addTerms, addTermsError] = useMutation(ADD_TERMS);
    const [deleteTerms] = useMutation(DELETE_TERMS);

    const [show, setShow] = React.useState(false);
    const [field, setField] = React.useState("");

    const { addToast } = useToasts();

    const handleClose = React.useCallback(() => {
        setShow(false);
        setField("");
    }, []);
    const handleShow = React.useCallback(() => setShow(true), []);
    const handleSave = React.useCallback(() => {
        try {
            addTerms({ variables: {
                title: field,
            },
            refetchQueries: [{ query: TERMS }] });
            handleClose();
            addToast("Successfully created", { appearance: "success", autoDismiss: true });
        } catch (e) {
            console.error(e);
        }
    }, [field]);

    const handleFieldChange = React.useCallback((e) => setField(e.target.value));
    const handleDelete = React.useCallback(({currentTarget}) => {
        try {
            deleteTerms({ variables: {
                id: currentTarget.value,
            },
            refetchQueries: [{ query: TERMS }] });
            addToast("Successfully deleted", { appearance: "success", autoDismiss: true });
        } catch (e) {
            console.error(e);
        }
    });

    return (
        <div className="terms">
            <ItemCRUDTopHeader
                title="Terms"
                description="Manage Delivery Terms"
                icon="truck"
                handleShow={handleShow}
            />

            <Table
                handleDelete={handleDelete}
                loading={loading}
                error={error}
                data={data}
                field="terms"
                cells={[
                    {name: "Terms", field: "title", width: 14},
                ]}
            />

            <Modal open={show} size="tiny">
                <Modal.Header>New Terms</Modal.Header>
                <Modal.Content>
                    <Form error={!!addTermsError.error}>
                        <Form.Input
                            placeholder="Terms"
                            label="Terms"
                            onChange={ handleFieldChange }
                            value={ field }
                        />
                        <Form.Field>
                            <Message
                                error
                                header="Error"
                                content={addTermsError.error && addTermsError.error.message}
                            />
                        </Form.Field>
                        <Button type="button" color="red" onClick={handleClose}>Cancel</Button>
                        <Button type="button" color="green" icon onClick={handleSave}><Icon name="user plus" /> Save</Button>
                    </Form>
                </Modal.Content>
            </Modal>
        </div>
    );
};
