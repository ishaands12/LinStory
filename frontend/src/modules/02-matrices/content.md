# The Grid Transformation

A **Matrix** is often taught as a box of numbers. But geometrically, it's a function that transforms space.

Watch what happens to the grid when you apply different matrices. The key rule: **Grid lines remain parallel and evenly spaced**, and the **Origin (0,0)** stays fixed. This is what makes it a *Linear* Transformation.

# Matrix-Vector Multiplication

How do we describe these transformations with numbers? We just key track of where the basis vectors land!

$$ i_{new} = \begin{bmatrix} a \\ c \end{bmatrix}, j_{new} = \begin{bmatrix} b \\ d \end{bmatrix} $$

The matrix is simply these two vectors stuck together:

$$ A = \begin{bmatrix} a & b \\ c & d \end{bmatrix} $$

Multiplying a vector applies this transformation to it.

# The Area Factor (Determinant)

The **Determinant** is simply the factor by which the transformation scales area.

Look at the yellow square (area = 1). After transformation, what is its new area? That is the determinant. If the determinant is 0, the space "collapses" into a lower dimension (a line or a point).

# Stubborn Directions (Eigenvectors)

Every time you play a 3D video game, the GPU is multiplying millions of matrices per second.

Most vectors get knocked off their span during a transformation (they rotate). But some vectors—**Eigenvectors**—stay on their own line. They only get stretched or squished by a factor called the **Eigenvalue**.

# Check Your Understanding

Let's verify your intuition about linear transformations.
