"""empty message

Revision ID: 4d0afb126fd5
Revises: 
Create Date: 2020-05-17 21:24:22.896078

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4d0afb126fd5'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('search_urls',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('url', sa.String(length=256), nullable=False),
    sa.Column('used', sa.Boolean(), server_default=sa.text('0'), nullable=True),
    sa.Column('dealer', sa.Boolean(), server_default=sa.text('1'), nullable=True),
    sa.Column('active', sa.Boolean(), server_default=sa.text('1'), nullable=True),
    sa.Column('date_added', sa.DateTime(), nullable=True),
    sa.Column('tag', sa.String(length=64), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('tag'),
    sa.UniqueConstraint('url')
    )
    op.create_table('listings',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('link', sa.String(length=512), nullable=False),
    sa.Column('title', sa.String(length=256), nullable=True),
    sa.Column('active', sa.Boolean(), server_default=sa.text('1'), nullable=True),
    sa.Column('location', sa.String(length=256), nullable=True),
    sa.Column('posted', sa.String(length=64), nullable=True),
    sa.Column('image_url', sa.String(length=1024), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('price', sa.String(length=128), nullable=True),
    sa.Column('url_id', sa.Integer(), nullable=False),
    sa.Column('used', sa.Boolean(), server_default=sa.text('0'), nullable=True),
    sa.Column('dealer', sa.Boolean(), server_default=sa.text('0'), nullable=True),
    sa.Column('details', sa.String(length=64), nullable=True),
    sa.ForeignKeyConstraint(['url_id'], ['search_urls.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('listings')
    op.drop_table('search_urls')
    # ### end Alembic commands ###
