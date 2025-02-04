import React from 'react';
import { ListGroup } from 'react-bootstrap';

const FiltersLabels = ({ tasks }) => {
    const categories = [...new Set(tasks.map(task => task.category))];

    return (
        <div>
            <h2>Filters & Labels</h2>
            <ListGroup>
                {categories.map(category => (
                    <ListGroup.Item key={category}>
                        {category}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default FiltersLabels;
