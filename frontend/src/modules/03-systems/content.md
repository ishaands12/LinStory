# The Intersection Perspective

Algebra teaches us to solve equations by "substitution" or "elimination". But Geometry tells a different story.

Each linear equation represents a **Line** (in 2D) or a **Plane** (in 3D). Solving the system means finding where these shapes **intersect**.

$$ 2x + y = 5 $$
$$ x - y = 1 $$

# The Matrix Perspective

We can rewrite the system as a matrix multiplication: $Ax = b$.

$$ \begin{bmatrix} 2 & 1 \\ 1 & -1 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 5 \\ 1 \end{bmatrix} $$

This shifts our perspective: We are looking for a vector $x$ that, when transformed by matrix $A$, lands on vector $b$.

# When Things Go Wrong (Singularity)

Sometimes, systems have **No Solution** (parallel lines) or **Infinite Solutions** (overlapping lines).

In vector land, this happens when the matrix $A$ squishes space into a lower dimension (Determinant is 0). If the target vector $b$ lies outside this squished line, you can never reach it!

# Check Your Understanding

Can you identify when a system is solvable?
